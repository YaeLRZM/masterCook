import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recetas — MasterCook",
};

// TODO: replace with prisma query
const MOCK_RECIPES = [
  {
    id: "1",
    name: "Risotto de champiñones",
    category: "Pastas",
    servings: 4,
    totalCost: 180,
    sellingPrice: 650,
    marginPct: 72,
    isSubRecipe: false,
  },
  {
    id: "2",
    name: "Caldo de pollo base",
    category: "Fondos",
    servings: 8,
    totalCost: 95,
    sellingPrice: 0,
    marginPct: 0,
    isSubRecipe: true,
  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recetas</h1>
          <p className="text-sm text-gray-500">{MOCK_RECIPES.length} recetas registradas</p>
        </div>
        <Link
          href="/recipes/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Nueva receta
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {["Nombre", "Categoría", "Porciones", "Costo total", "Precio venta", "Margen"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {MOCK_RECIPES.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/recipes/${r.id}`} className="font-medium text-sm text-brand-600 hover:underline">
                      {r.name}
                    </Link>
                    {r.isSubRecipe && (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                        Sub-receta
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.servings}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{fmt(r.totalCost)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {r.isSubRecipe ? "—" : fmt(r.sellingPrice)}
                </td>
                <td className="px-4 py-3">
                  {r.isSubRecipe ? (
                    <span className="text-xs text-gray-400">N/A</span>
                  ) : (
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${r.marginPct >= 65 ? "bg-success-50 text-success-700" : r.marginPct >= 50 ? "bg-warning-50 text-warning-700" : "bg-error-50 text-error-700"}`}>
                      {r.marginPct}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
