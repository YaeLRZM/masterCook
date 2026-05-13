"use client";

import {
  Plus,
} from "lucide-react";

export default function NewIngredientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          New Ingredient
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new inventory ingredient
        </p>
      </div>

      {/* FORM */}

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {/* NAME */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Ingredient Name
            </label>

            <input
              type="text"
              placeholder="Tomato..."
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* UNIT */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Unit
            </label>

            <select className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500">
              <option>kg</option>

              <option>g</option>

              <option>L</option>

              <option>ml</option>

              <option>pcs</option>
            </select>
          </div>

          {/* STOCK */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Initial Stock
            </label>

            <input
              type="number"
              placeholder="20"
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* COST */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cost
            </label>

            <input
              type="number"
              placeholder="$30"
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* BUTTON */}

        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600">
            <Plus className="h-4 w-4" />

            Add Ingredient
          </button>
        </div>
      </div>
    </div>
  );
}