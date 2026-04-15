import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — MasterCook",
  description: "Panel de inteligencia de negocio para tu cocina",
};

const MOCK_METRICS = {
  totalRecipes: 24,
  totalIngredients: 87,
  totalEvents: 5,
  pendingQuotes: 2,
};

const MOCK_TOP_DISHES = [
  { name: "Risotto de champiñones", marginPct: 72, profit: 85 },
  { name: "Pollo en salsa verde", marginPct: 68, profit: 62 },
  { name: "Tiramisú individual", marginPct: 80, profit: 45 },
];

const MOCK_RECENT_EVENTS = [
  { name: "Boda García", date: "2026-04-01", quoted: 38000, cost: 14200, profit: 23800 },
  { name: "Cumpleaños corporativo", date: "2026-03-20", quoted: 12000, cost: 5100, profit: 6900 },
];

function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-2xl p-5 ${color} shadow-sm`}>
      <p className="text-sm font-medium text-white/80">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rentabilidad y actividad reciente de tu cocina
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Recetas" value={MOCK_METRICS.totalRecipes} color="bg-brand-500" />
        <MetricCard label="Ingredientes" value={MOCK_METRICS.totalIngredients} color="bg-orange-500" />
        <MetricCard label="Eventos" value={MOCK_METRICS.totalEvents} color="bg-success-500" />
        <MetricCard label="Cotizaciones pendientes" value={MOCK_METRICS.pendingQuotes} color="bg-warning-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Profitable Dishes */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
            Platillos más rentables
          </h2>
          <ul className="space-y-3">
            {MOCK_TOP_DISHES.map((dish, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 font-bold text-sm">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{dish.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${dish.marginPct}%` }} />
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">{dish.marginPct}%</span>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-success-600">
                  {fmt(dish.profit)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Event Profits */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
            Ganancia real — eventos recientes
          </h2>
          <ul className="space-y-4">
            {MOCK_RECENT_EVENTS.map((ev, i) => (
              <li key={i} className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{ev.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ev.date}</p>
                  </div>
                  <span className="rounded-lg bg-success-50 dark:bg-success-500/15 px-2.5 py-1 text-xs font-bold text-success-700 dark:text-success-400">
                    +{fmt(ev.profit)}
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span>Cotizado: {fmt(ev.quoted)}</span>
                  <span>Costo: {fmt(ev.cost)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
