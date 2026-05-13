import Link from "next/link";

import PageHeader from "@/components/common/PageHeader";

import { ingredients } from "@/mocks/ingredients.mock";

import {
  Package,
  Plus,
} from "lucide-react";

export default function IngredientsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Ingredients"
        description="Manage kitchen inventory"
      />

      {/* ACTIONS */}

      <div className="flex justify-end">
        <Link
          href="/chef/ingredients/new"
          className="flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />

          New Ingredient
        </Link>
      </div>

      {/* GRID */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* ICON */}

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
              <Package className="h-7 w-7 text-orange-600" />
            </div>

            {/* CONTENT */}

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {ingredient.name}
                </h2>

                <p className="text-sm text-gray-500">
                  Inventory item
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    Stock
                  </p>

                  <p className="font-semibold">
                    {ingredient.stock}{" "}
                    {ingredient.unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Cost
                  </p>

                  <p className="font-semibold text-orange-600">
                    ${ingredient.cost}
                  </p>
                </div>
              </div>

              <button className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-medium hover:bg-gray-50">
                Edit Ingredient
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}