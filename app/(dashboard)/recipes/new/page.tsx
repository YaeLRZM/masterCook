import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nueva receta — MasterCook" };

export default function NewRecipePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva receta</h1>
        <p className="text-sm text-gray-500">Configura ingredientes, mermas y precio de venta</p>
      </div>
      {/* TODO: RecipeForm client component */}
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-400">RecipeForm — por implementar</p>
        <p className="text-xs text-gray-400 mt-1">
          Conectar con <code>components/recipes/RecipeForm.tsx</code>
        </p>
      </div>
    </div>
  );
}
