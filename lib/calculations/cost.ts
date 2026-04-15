/**
 * Cost Engine
 *
 * Calculates total recipe cost (direct + indirect) and handles
 * event scaling (recalibration when guestCount changes).
 */

import Decimal from "decimal.js";
import { convertUnit } from "./units";
import { ingredientCostBreakdown } from "./yield";

Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP });

// ── Types ────────────────────────────────────────────────────────────────────

export interface IngredientCostInput {
  ingredientId?: string;
  subRecipeId?: string;
  name: string;
  quantity: number;         // in recipe unit
  recipeUnit: string;       // recipe unit symbol
  purchaseUnit: string;     // purchase unit symbol
  pricePerPurchaseUnit: number;
  yieldPct: number;         // 0–100
}

export interface IndirectCostInput {
  name: string;
  type: "LABOR" | "ENERGY" | "PACKAGING" | "OVERHEAD" | "OTHER";
  basis: "PER_BATCH" | "PERCENTAGE";
  amount: number;
}

export interface CostLineItem {
  name: string;
  grossWeight: number;
  netWeight: number;
  yieldPct: number;
  pricePerRecipeUnit: number;
  totalCost: number;
}

export interface RecipeCostResult {
  lines: CostLineItem[];
  directCost: number;
  indirectCost: number;
  totalCost: number;
  costPerServing: number;
}

// ── Direct Cost ───────────────────────────────────────────────────────────────

/**
 * Calculate cost for a single ingredient line.
 */
export function calcIngredientLineCost(item: IngredientCostInput): CostLineItem {
  // Convert price from purchase unit → recipe unit
  const qtyInPurchaseUnit = convertUnit(1, item.purchaseUnit, item.recipeUnit);
  // price per recipe unit = price per purchase unit / units per purchase
  const pricePerRecipeUnit = new Decimal(item.pricePerPurchaseUnit)
    .div(qtyInPurchaseUnit)
    .toNumber();

  const breakdown = ingredientCostBreakdown({
    quantity: item.quantity,
    pricePerRecipeUnit,
    yieldPct: item.yieldPct,
  });

  return {
    name: item.name,
    grossWeight: breakdown.grossWeight,
    netWeight: breakdown.netWeight,
    yieldPct: breakdown.yieldPct,
    pricePerRecipeUnit,
    totalCost: breakdown.totalCost,
  };
}

/**
 * Calculate full recipe cost including indirect costs.
 */
export function calcRecipeCost(
  ingredients: IngredientCostInput[],
  indirectCosts: IndirectCostInput[],
  servings: number
): RecipeCostResult {
  const lines: CostLineItem[] = ingredients.map(calcIngredientLineCost);

  const directCost = lines
    .reduce((acc, l) => acc.plus(l.totalCost), new Decimal(0))
    .toNumber();

  const indirectCost = indirectCosts.reduce((acc, ic) => {
    let value: number;
    if (ic.basis === "PER_BATCH") {
      value = ic.amount;
    } else {
      // PERCENTAGE of direct cost
      value = new Decimal(directCost).mul(ic.amount).div(100).toNumber();
    }
    return acc.plus(value);
  }, new Decimal(0)).toNumber();

  const totalCost = new Decimal(directCost).plus(indirectCost).toNumber();
  const costPerServing = servings > 0
    ? new Decimal(totalCost).div(servings).toNumber()
    : 0;

  return { lines, directCost, indirectCost, totalCost, costPerServing };
}

// ── Event Scaling (Recalibración Dinámica) ───────────────────────────────────

export interface EventDish {
  recipeId: string;
  recipeName: string;
  costPerServing: number;  // pre-calculated from recipe
  servingsPerGuest: number;
}

export interface EventShoppingLine {
  ingredientName: string;
  totalGrossQty: number;
  totalNetQty: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface EventCostResult {
  guestCount: number;
  dishes: Array<{
    recipeId: string;
    recipeName: string;
    totalServings: number;
    unitCost: number;
    totalCost: number;
  }>;
  totalFoodCost: number;
  staffCost: number;
  grandTotal: number;
  costPerPerson: number;
}

/**
 * Recalculate event costs for a new guest count.
 * This is the "Recalibración Dinámica de Eventos" engine.
 */
export function recalibrateEvent(
  dishes: EventDish[],
  guestCount: number,
  staffCost: number = 0
): EventCostResult {
  const scaledDishes = dishes.map((dish) => {
    const totalServings = new Decimal(dish.servingsPerGuest).mul(guestCount).toNumber();
    const totalCost = new Decimal(dish.costPerServing).mul(totalServings).toNumber();
    return {
      recipeId: dish.recipeId,
      recipeName: dish.recipeName,
      totalServings,
      unitCost: dish.costPerServing,
      totalCost,
    };
  });

  const totalFoodCost = scaledDishes
    .reduce((acc, d) => acc.plus(d.totalCost), new Decimal(0))
    .toNumber();

  const grandTotal = new Decimal(totalFoodCost).plus(staffCost).toNumber();
  const costPerPerson = guestCount > 0
    ? new Decimal(grandTotal).div(guestCount).toNumber()
    : 0;

  return {
    guestCount,
    dishes: scaledDishes,
    totalFoodCost,
    staffCost,
    grandTotal,
    costPerPerson,
  };
}
