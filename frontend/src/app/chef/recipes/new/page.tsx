"use client";

import {
  Plus,
} from "lucide-react";

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          New Recipe
        </h1>

        <p className="mt-2 text-gray-500">
          Create a new kitchen recipe
        </p>
      </div>

      {/* FORM */}

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {/* NAME */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Recipe Name
            </label>

            <input
              type="text"
              placeholder="Risotto..."
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* CATEGORY */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Category
            </label>

            <input
              type="text"
              placeholder="Italian..."
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* COST */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Estimated Cost
            </label>

            <input
              type="number"
              placeholder="$200"
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* SERVINGS */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Servings
            </label>

            <input
              type="number"
              placeholder="4"
              className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* STEPS */}

        <div className="mt-8 space-y-2">
          <label className="text-sm font-medium">
            Preparation Steps
          </label>

          <textarea
            rows={6}
            placeholder="Write preparation instructions..."
            className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-orange-500"
          />
        </div>

        {/* BUTTON */}

        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600">
            <Plus className="h-4 w-4" />

            Create Recipe
          </button>
        </div>
      </div>
    </div>
  );
}