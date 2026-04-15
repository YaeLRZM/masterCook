/**
 * Unit Conversion Engine
 *
 * Converts between purchase units and recipe units using a two-step approach:
 *   value → base unit → target unit
 *
 * Base units: grams (mass), milliliters (volume), unit (countable)
 */

export type UnitSymbol = string;

interface UnitDefinition {
  toBase: number; // multiply to convert TO base unit
  type: "MASS" | "VOLUME" | "UNIT";
}

// ── Built-in conversion table ─────────────────────────────────────────────────
// Mass base: grams (g)
// Volume base: milliliters (ml)
// Unit base: unit (pza)

export const UNIT_TABLE: Record<UnitSymbol, UnitDefinition> = {
  // MASS
  g:    { toBase: 1,       type: "MASS" },
  kg:   { toBase: 1000,    type: "MASS" },
  mg:   { toBase: 0.001,   type: "MASS" },
  oz:   { toBase: 28.3495, type: "MASS" },
  lb:   { toBase: 453.592, type: "MASS" },

  // VOLUME
  ml:   { toBase: 1,       type: "VOLUME" },
  l:    { toBase: 1000,    type: "VOLUME" },
  L:    { toBase: 1000,    type: "VOLUME" },
  dl:   { toBase: 100,     type: "VOLUME" },
  cl:   { toBase: 10,      type: "VOLUME" },
  tsp:  { toBase: 4.929,   type: "VOLUME" }, // teaspoon
  tbsp: { toBase: 14.787,  type: "VOLUME" }, // tablespoon
  cup:  { toBase: 236.588, type: "VOLUME" }, // US cup
  floz: { toBase: 29.5735, type: "VOLUME" }, // fluid ounce
  pt:   { toBase: 473.176, type: "VOLUME" }, // pint
  qt:   { toBase: 946.353, type: "VOLUME" }, // quart
  gal:  { toBase: 3785.41, type: "VOLUME" }, // gallon

  // COUNTABLE UNITS
  pza:  { toBase: 1, type: "UNIT" },
  unit: { toBase: 1, type: "UNIT" },
  pcs:  { toBase: 1, type: "UNIT" },
  doz:  { toBase: 12, type: "UNIT" }, // dozen
};

/** Convert a value from one unit symbol to another.
 *  Both units must be the same type (MASS→MASS, VOLUME→VOLUME, UNIT→UNIT).
 *  Throws if units are incompatible or unknown.
 */
export function convertUnit(value: number, from: UnitSymbol, to: UnitSymbol): number {
  const fromDef = UNIT_TABLE[from];
  const toDef = UNIT_TABLE[to];

  if (!fromDef) throw new Error(`Unknown unit: "${from}"`);
  if (!toDef) throw new Error(`Unknown unit: "${to}"`);
  if (fromDef.type !== toDef.type) {
    throw new Error(`Incompatible unit types: "${from}" (${fromDef.type}) → "${to}" (${toDef.type})`);
  }

  const baseValue = value * fromDef.toBase;
  return baseValue / toDef.toBase;
}

/** Returns true if two unit symbols are the same type. */
export function areUnitsCompatible(a: UnitSymbol, b: UnitSymbol): boolean {
  const defA = UNIT_TABLE[a];
  const defB = UNIT_TABLE[b];
  return !!defA && !!defB && defA.type === defB.type;
}

/**
 * Calculate how many recipe units fit in one purchase unit.
 * Example: 1 kg → 1000 g, so conversionFactor = 1000
 */
export function calcConversionFactor(
  purchaseUnit: UnitSymbol,
  recipeUnit: UnitSymbol
): number {
  return convertUnit(1, purchaseUnit, recipeUnit);
}

/**
 * Given a quantity in recipeUnit, return the equivalent in purchaseUnit.
 * Useful to know how much to buy.
 */
export function recipeToPurchase(
  recipeQty: number,
  recipeUnit: UnitSymbol,
  purchaseUnit: UnitSymbol
): number {
  return convertUnit(recipeQty, recipeUnit, purchaseUnit);
}
