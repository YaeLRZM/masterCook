import type { Metadata } from "next";
import {
  TrendingUp,
  TrendingDown,
  ChefHat,
  CalendarDays,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — MasterCook",
  description: "Panel de inteligencia de negocio para tu cocina",
};

const MOCK = {
  revenue: 50900,
  revenuePrev: 45300,
  totalCost: 19300,
  totalProfit: 31600,
  avgMargin: 72.3,
  totalRecipes: 24,
  totalEvents: 5,
  pendingQuotes: 2,
  totalIngredients: 87,
};

const MOCK_TOP_DISHES = [
  { name: "Risotto de champiñones", marginPct: 72, profit: 8500 },
  { name: "Tiramisú individual", marginPct: 80, profit: 5400 },
  { name: "Pollo en salsa verde", marginPct: 68, profit: 6200 },
  { name: "Sopa de lima yucateca", marginPct: 65, profit: 3800 },
];

const MOCK_RECENT_EVENTS = [
  { name: "Boda García", date: "2026-04-01", guests: 120, quoted: 38000, cost: 14200, profit: 23800, status: "COMPLETED" },
  { name: "Cumpleaños corporativo", date: "2026-03-20", guests: 50, quoted: 12000, cost: 5100, profit: 6900, status: "CONFIRMED" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

const pct = (a: number, b: number) => (((a - b) / b) * 100).toFixed(1);

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent ? "bg-brand-50 dark:bg-brand-500/10" : "bg-gray-100 dark:bg-gray-800"}`}>
          <Icon size={14} className={accent ? "text-brand-500" : "text-gray-500 dark:text-gray-400"} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const revenueChange = parseFloat(pct(MOCK.revenue, MOCK.revenuePrev));
  const isPositive = revenueChange > 0;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Rentabilidad de tu cocina · Abril 2026</p>
      </div>

      {/* ── Bento Row 1 ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Revenue hero card */}
        <div className="col-span-12 md:col-span-7 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Ingresos del mes
              </p>
              <p className="mt-1.5 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {fmt(MOCK.revenue)}
              </p>
            </div>
            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              isPositive
                ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400"
            }`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? "+" : ""}{revenueChange}% vs. mes anterior
            </span>
          </div>

          {/* Revenue / Cost split bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">Ingreso → Costo → Ganancia</span>
              <span className="text-xs font-medium text-success-600 dark:text-success-400">
                Margen {MOCK.avgMargin}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
              <div
                className="h-full bg-gray-300 dark:bg-gray-600 rounded-l-full"
                style={{ width: `${(MOCK.totalCost / MOCK.revenue) * 100}%` }}
              />
              <div
                className="h-full bg-brand-500 rounded-r-full"
                style={{ width: `${(MOCK.totalProfit / MOCK.revenue) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Costo total</p>
              <p className="mt-0.5 text-base font-medium text-gray-700 dark:text-gray-300">{fmt(MOCK.totalCost)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ganancia neta</p>
              <p className="mt-0.5 text-base font-medium text-success-600 dark:text-success-400">{fmt(MOCK.totalProfit)}</p>
            </div>
          </div>
        </div>

        {/* Right column – 3 mini stat cards */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
          <StatCard label="Recetas activas" value={MOCK.totalRecipes} icon={ChefHat} accent />
          <StatCard label="Eventos este mes" value={MOCK.totalEvents} icon={CalendarDays} />
          <div className="rounded-xl border border-warning-300 dark:border-warning-700/50 bg-warning-50 dark:bg-warning-500/5 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-warning-700 dark:text-warning-400">Cotizaciones pendientes</p>
              <p className="mt-1.5 text-2xl font-semibold text-warning-800 dark:text-warning-300">{MOCK.pendingQuotes}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center">
              <Clock size={15} className="text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bento Row 2 ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Top profitable dishes */}
        <div className="col-span-12 md:col-span-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Platillos más rentables</h2>
            <span className="text-xs text-gray-400">Por margen %</span>
          </div>
          <ul className="space-y-4">
            {MOCK_TOP_DISHES.map((dish, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="text-xs font-medium text-gray-400 w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{dish.name}</p>
                    <span className="shrink-0 ml-3 text-xs font-semibold text-gray-500 dark:text-gray-400">{dish.marginPct}%</span>
                  </div>
                  <div className="h-px w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-px bg-brand-500 rounded-full"
                      style={{ width: `${dish.marginPct}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-success-600 dark:text-success-400 tabular-nums">
                  {fmt(dish.profit)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Average margin highlight */}
        <div className="col-span-12 md:col-span-4 rounded-xl border border-brand-200 dark:border-brand-500/20 bg-brand-25 dark:bg-brand-500/5 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
              Margen promedio
            </p>
            <p className="mt-3 text-5xl font-semibold text-brand-600 dark:text-brand-300 tracking-tight">
              {MOCK.avgMargin}
              <span className="text-2xl">%</span>
            </p>
          </div>
          <div className="pt-4 border-t border-brand-200 dark:border-brand-500/20">
            <p className="text-xs text-brand-500 dark:text-brand-400">
              {MOCK.totalIngredients} ingredientes en inventario
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Events ───────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Eventos recientes</h2>
          <a href="/events" className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium">
            Ver todos <ArrowUpRight size={12} />
          </a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {["Evento", "Fecha", "Comensales", "Cotizado", "Costo", "Ganancia"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {MOCK_RECENT_EVENTS.map((ev, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{ev.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{ev.date}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{ev.guests}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 tabular-nums">{fmt(ev.quoted)}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{fmt(ev.cost)}</td>
                <td className="px-6 py-4 font-medium text-success-600 dark:text-success-400 tabular-nums">
                  +{fmt(ev.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
