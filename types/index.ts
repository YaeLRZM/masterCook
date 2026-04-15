// ─── Shared TypeScript types for master-cook ─────────────────────────────────
// These mirror the Prisma schema but are safe to import in client components.

export type UnitType = "MASS" | "VOLUME" | "UNIT";
export type PricingMethod = "FIXED_MARGIN" | "MULTIPLIER" | "MANUAL";
export type EventStatus = "DRAFT" | "QUOTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type IndirectCostType = "LABOR" | "ENERGY" | "PACKAGING" | "OVERHEAD" | "OTHER";
export type IndirectCostBasis = "PER_BATCH" | "PERCENTAGE";
export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

// ── Unit ──────────────────────────────────────────────────────────────────────

export interface UnitDTO {
  id: string;
  name: string;
  symbol: string;
  type: UnitType;
}

// ── Category ─────────────────────────────────────────────────────────────────

export interface CategoryDTO {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// ── Ingredient ───────────────────────────────────────────────────────────────

export interface IngredientDTO {
  id: string;
  name: string;
  description?: string;
  category?: CategoryDTO;
  purchaseUnit: UnitDTO;
  pricePerPurchaseUnit: number;
  recipeUnit: UnitDTO;
  conversionFactor: number;
  yieldPercentage: number;
  supplier?: string;
  notes?: string;
  isActive: boolean;
}

export interface IngredientFormData {
  name: string;
  description?: string;
  categoryId?: string;
  purchaseUnitId: string;
  pricePerPurchaseUnit: number;
  recipeUnitId: string;
  conversionFactor: number;
  yieldPercentage: number;
  supplier?: string;
  notes?: string;
}

// ── Recipe ───────────────────────────────────────────────────────────────────

export interface RecipeIngredientDTO {
  id: string;
  ingredientId?: string;
  ingredient?: IngredientDTO;
  subRecipeId?: string;
  subRecipeName?: string;
  quantity: number;
  unit: UnitDTO;
  grossWeight: number;
  netWeight: number;
  yieldPct: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
  order: number;
}

export interface IndirectCostDTO {
  id: string;
  name: string;
  type: IndirectCostType;
  basis: IndirectCostBasis;
  amount: number;
  totalCost: number;
}

export interface RecipeDTO {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: CategoryDTO;
  servings: number;
  preparationTime?: number;
  cookingTime?: number;
  directCost: number;
  indirectCost: number;
  totalCost: number;
  costPerServing: number;
  pricingMethod: PricingMethod;
  marginPercentage?: number;
  multiplierFactor?: number;
  sellingPrice: number;
  profitPerServing: number;
  marginPct: number;
  isSubRecipe: boolean;
  ingredients: RecipeIngredientDTO[];
  indirectCosts: IndirectCostDTO[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface RecipeFormData {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  servings: number;
  preparationTime?: number;
  cookingTime?: number;
  pricingMethod: PricingMethod;
  marginPercentage?: number;
  multiplierFactor?: number;
  sellingPrice?: number;
  isSubRecipe: boolean;
}

// ── Event ────────────────────────────────────────────────────────────────────

export interface EventRecipeDTO {
  id: string;
  recipe: RecipeDTO;
  servingsPerGuest: number;
  totalServings: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
  order: number;
}

export interface EventDTO {
  id: string;
  name: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  eventDate: string;
  guestCount: number;
  status: EventStatus;
  totalCost: number;
  costPerPerson: number;
  quotedPrice: number;
  pricePerPerson: number;
  termsConditions?: string;
  staffCount?: number;
  staffCostTotal?: number;
  notes?: string;
  recipes: EventRecipeDTO[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface EventFormData {
  name: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  eventDate: string;
  guestCount: number;
  quotedPrice?: number;
  termsConditions?: string;
  staffCount?: number;
  staffCostTotal?: number;
  notes?: string;
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalRecipes: number;
  totalIngredients: number;
  totalEvents: number;
  pendingQuotes: number;
  topProfitableDishes: Array<{
    recipeId: string;
    recipeName: string;
    marginPct: number;
    profitPerServing: number;
  }>;
  recentEventProfits: Array<{
    eventId: string;
    eventName: string;
    eventDate: string;
    quotedPrice: number;
    totalCost: number;
    profit: number;
  }>;
  topIngredients: Array<{
    ingredientId: string;
    ingredientName: string;
    usageCount: number;
  }>;
}
