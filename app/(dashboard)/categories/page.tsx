import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categorías — MasterCook" };

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categorías</h1>
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-400">Gestión de categorías — por implementar</p>
      </div>
    </div>
  );
}
