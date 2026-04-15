/**
 * Yield / Merma Calculation Engine
 *
 * Terminology:
 *   Gross Weight (Peso Bruto)  = quantity purchased / as-bought weight
 *   Net Weight  (Peso Neto)   = gross × yieldPct — usable after trimming/cooking
 *   Yield %     (Merma %)     = (netWeight / grossWeight) × 100
 *   Waste  %                  = 100 − yieldPct
 */

import Decimal from "decimal.js";

Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP });

/**
 * Convert gross (purchased) weight to net (usable) weight.
 * yieldPct: 0–100 (e.g. 80 means 20% waste)
 */
export function grossToNet(grossWeight: number, yieldPct: number): number {
  if (yieldPct <= 0 || yieldPct > 100) throw new Error("yieldPct must be between 1 and 100");
  return new Decimal(grossWeight).mul(yieldPct).div(100).toNumber();
}

/**
 * Convert net (usable) weight back to gross (purchased) weight.
 * Useful when a recipe specifies net amounts and we need to know how much to buy.
 */
export function netToGross(netWeight: number, yieldPct: number): number {
  if (yieldPct <= 0 || yieldPct > 100) throw new Error("yieldPct must be between 1 and 100");
  return new Decimal(netWeight).mul(100).div(yieldPct).toNumber();
}

/**
 * Calculate the effective cost per recipe unit accounting for yield.
 * If you buy 1 kg at $100 with 80% yield → effective cost = $100 / 0.80 = $125 / kg net
 */
export function costAfterYield(purchaseCostPerUnit: number, yieldPct: number): number {
  if (yieldPct <= 0 || yieldPct > 100) throw new Error("yieldPct must be between 1 and 100");
  return new Decimal(purchaseCostPerUnit).mul(100).div(yieldPct).toNumber();
}

/**
 * Full ingredient cost breakdown for a given quantity.
 * Returns both gross and net weights plus cost.
 */
export function ingredientCostBreakdown(params: {
  quantity: number;        // amount the recipe needs (in recipe units)
  pricePerRecipeUnit: number; // price per recipe unit (already converted from purchase unit)
  yieldPct: number;        // 0–100
}): {
  grossWeight: number;
  netWeight: number;
  yieldPct: number;
  costPerNetUnit: number;
  totalCost: number;
} {
  const { quantity, pricePerRecipeUnit, yieldPct } = params;
  // recipe specifies NET quantity → need to buy more (gross)
  const grossWeight = netToGross(quantity, yieldPct);
  const netWeight = quantity;
  const costPerNetUnit = costAfterYield(pricePerRecipeUnit, yieldPct);
  const totalCost = new Decimal(costPerNetUnit).mul(netWeight).toNumber();

  return { grossWeight, netWeight, yieldPct, costPerNetUnit, totalCost };
}

/**
 * Calculate yield percentage from known gross and net weights.
 */
export function calcYieldPct(grossWeight: number, netWeight: number): number {
  if (grossWeight <= 0) throw new Error("grossWeight must be > 0");
  return new Decimal(netWeight).div(grossWeight).mul(100).toDecimalPlaces(2).toNumber();
}
