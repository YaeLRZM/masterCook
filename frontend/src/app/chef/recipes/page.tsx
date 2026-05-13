import Link from "next/link";

import PageHeader from "@/components/common/PageHeader";

import { recipes } from "@/mocks/recipes.mock";

import {
  Plus,
  ChefHat,
} from "lucide-react";

export default function RecipesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recipes"
        description="Manage all kitchen recipes"
      />

      {/* ACTIONS */}

      <div className="flex justify-end">
        <Link
          href="/chef/recipes/new"
          className="flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />

          New Recipe
        </Link>
      </div>

      {/* GRID */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* IMAGE */}

            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
              <ChefHat className="h-16 w-16 text-orange-400" />
            </div>

            {/* CONTENT */}

            <div className="space-y-4 p-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {recipe.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {recipe.category}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    Cost
                  </p>

                  <p className="font-semibold text-orange-600">
                    ${recipe.cost}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Servings
                  </p>

                  <p className="font-semibold">
                    {recipe.servings}
                  </p>
                </div>
              </div>

              <button className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-medium hover:bg-gray-50">
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}