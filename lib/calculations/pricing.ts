/**
 * Pricing Models Engine
 *
 * Supports:
 *   1. Fixed Margin %   — sell = cost / (1 - margin/100)
 *   2. Multiplier       — sell = cost × factor
 *   3. Manual           — price entered directly
 */

import Decimal from "decimal.js";

Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP });

export type PricingMethod = "FIXED_MARGIN" | "MULTIPLIER" | "MANUAL";

// ── Price Calculation ─────────────────────────────────────────────────────────

/**
 * Calculate selling price from cost using a fixed margin percentage.
 * margin: 0–99 (e.g. 65 = 65% margin, food-cost ratio = 35%)
 *
 * Formula: price = cost / (1 - margin/100)
 * If margin=0, price = cost (no margin — avoid in production).
 */
export function priceByMargin(cost: number, marginPct: number): number {
  if (marginPct < 0 || marginPct >= 100) {
    throw new Error("marginPct must be between 0 and 99.99");
  }
  if (marginPct === 0) return cost;
  return new Decimal(cost).div(new Decimal(1).minus(new Decimal(marginPct).div(100))).toNumber();
}

/**
 * Calculate selling price using a multiplier factor.
 * Common values: ×2.5, ×3, ×3.5
 *
 * Formula: price = cost × factor
 */
export function priceByMultiplier(cost: number, factor: number): number {
  if (factor <= 0) throw new Error("factor must be > 0");
  return new Decimal(cost).mul(factor).toNumber();
}

/**
 * Calculate the actual gross margin % achieved from a cost/price pair.
 * Returns 0 if price is 0.
 */
export function actualMarginPct(cost: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0;
  return new Decimal(sellingPrice).minus(cost).div(sellingPrice).mul(100).toDecimalPlaces(2).toNumber();
}

/**
 * Calculate the food cost % (inverse of margin).
 * foodCostPct = (cost / sellingPrice) × 100
 */
export function foodCostPct(cost: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0;
  return new Decimal(cost).div(sellingPrice).mul(100).toDecimalPlaces(2).toNumber();
}

/**
 * Calculate absolute profit from a selling price and cost.
 */
export function absoluteProfit(cost: number, sellingPrice: number): number {
  return new Decimal(sellingPrice).minus(cost).toNumber();
}

/**
 * Unified pricing calculation — returns all pricing metrics at once.
 */
export function calcPricing(
  cost: number,
  method: PricingMethod,
  options: {
    marginPct?: number;
    multiplier?: number;
    manualPrice?: number;
  }
): {
  sellingPrice: number;
  profit: number;
  marginPct: number;
  foodCostPct: number;
  method: PricingMethod;
} {
  let sellingPrice: number;

  switch (method) {
    case "FIXED_MARGIN":
      if (options.marginPct == null) throw new Error("marginPct required for FIXED_MARGIN");
      sellingPrice = priceByMargin(cost, options.marginPct);
      break;
    case "MULTIPLIER":
      if (options.multiplier == null) throw new Error("multiplier required for MULTIPLIER");
      sellingPrice = priceByMultiplier(cost, options.multiplier);
      break;
    case "MANUAL":
      if (options.manualPrice == null) throw new Error("manualPrice required for MANUAL");
      sellingPrice = options.manualPrice;
      break;
    default:
      throw new Error(`Unknown pricing method: ${method}`);
  }

  return {
    sellingPrice,
    profit: absoluteProfit(cost, sellingPrice),
    marginPct: actualMarginPct(cost, sellingPrice),
    foodCostPct: foodCostPct(cost, sellingPrice),
    method,
  };
}

/**
 * Given a desired selling price and cost, find which multiplier was used.
 */
export function reverseMultiplier(cost: number, sellingPrice: number): number {
  if (cost <= 0) throw new Error("cost must be > 0");
  return new Decimal(sellingPrice).div(cost).toDecimalPlaces(4).toNumber();
}
