import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Ingredientes — MasterCook" };

// TODO: replace with prisma query
const MOCK_INGREDIENTS = [
  {
    id: "1",
    name: "Champiñón blanco",
    category: "Vegetales",
    purchaseUnit: "kg",
    price: 45,
    yieldPct: 88,
    effectivePrice: 51.14,
  },
  {
    id: "2",
    name: "Pechuga de pollo",
    category: "Carnes",
    purchaseUnit: "kg",
    price: 130,
    yieldPct: 90,
    effectivePrice: 144.44,
  },
  {
    id: "3",
    name: "Crema para batir",
    category: "Lácteos",
    purchaseUnit: "L",
    price: 68,
    yieldPct: 100,
    effectivePrice: 68,
  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function IngredientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredientes</h1>
          <p className="text-sm text-gray-500">{MOCK_INGREDIENTS.length} ingredientes registrados</p>
        </div>
        <Link
          href="/ingredients/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Nuevo ingrediente
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {["Nombre", "Categoría", "Unidad compra", "Precio/unidad", "Rendimiento %", "Precio efectivo (neto)"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {MOCK_INGREDIENTS.map((ing) => (
              <tr key={ing.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3 font-medium text-sm text-gray-800 dark:text-white">{ing.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{ing.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{ing.purchaseUnit}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{fmt(ing.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div className="h-1.5 rounded-full bg-brand-400" style={{ width: `${ing.yieldPct}%` }} />
                    </div>
                    <span className="text-sm text-gray-600">{ing.yieldPct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {fmt(ing.effectivePrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
