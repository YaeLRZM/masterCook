import {
  ChefHat,
  Clock3,
} from "lucide-react";

const recipes = [
  {
    id: 1,
    name: "Risotto de Champiñones",
    time: "45 min",
    steps: [
      "Calentar caldo.",
      "Saltear champiñones.",
      "Agregar arroz arborio.",
      "Añadir parmesano.",
    ],
  },

  {
    id: 2,
    name: "Cheesecake",
    time: "60 min",
    steps: [
      "Preparar base.",
      "Mezclar queso crema.",
      "Hornear.",
      "Refrigerar.",
    ],
  },
];

export default function AuxiliarRecipesPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Kitchen Recipes
        </h1>

        <p className="mt-2 text-gray-500">
          Follow step-by-step instructions
        </p>
      </div>

      {/* RECIPES */}

      <div className="grid gap-8 xl:grid-cols-2">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            {/* TOP */}

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <ChefHat className="h-7 w-7 text-blue-600" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    {recipe.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Clock3 className="h-4 w-4" />

                    {recipe.time}
                  </div>
                </div>
              </div>
            </div>

            {/* STEPS */}

            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-slate-50 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <p className="text-sm text-gray-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}