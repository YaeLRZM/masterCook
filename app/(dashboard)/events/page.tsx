import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Eventos — MasterCook" };

const STATUS_STYLES: Record<string, string> = {
  DRAFT:     "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  QUOTED:    "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  CONFIRMED: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  COMPLETED: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  CANCELLED: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Borrador", QUOTED: "Cotizado", CONFIRMED: "Confirmado",
  COMPLETED: "Completado", CANCELLED: "Cancelado",
};

// TODO: replace with prisma query
const MOCK_EVENTS = [
  { id: "1", name: "Boda García", client: "Carlos García", date: "2026-04-01", guests: 120, quoted: 38000, cost: 14200, status: "COMPLETED" },
  { id: "2", name: "Cumpleaños corporativo", client: "Tech Corp SA", date: "2026-04-20", guests: 50, quoted: 12000, cost: 5100, status: "CONFIRMED" },
  { id: "3", name: "Graduación López", client: "María López", date: "2026-05-10", guests: 80, quoted: 0, cost: 0, status: "DRAFT" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eventos</h1>
          <p className="text-sm text-gray-500">{MOCK_EVENTS.length} eventos registrados</p>
        </div>
        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Nueva cotización
        </Link>
      </div>

      <div className="grid gap-4">
        {MOCK_EVENTS.map((ev) => (
          <div
            key={ev.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/events/${ev.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-600 transition-colors">
                    {ev.name}
                  </Link>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[ev.status]}`}>
                    {STATUS_LABEL[ev.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {ev.client} · {ev.date} · {ev.guests} comensales
                </p>
              </div>
              <div className="text-right shrink-0">
                {ev.quoted > 0 ? (
                  <>
                    <p className="text-xs text-gray-400">Cotizado</p>
                    <p className="font-bold text-gray-900 dark:text-white">{fmt(ev.quoted)}</p>
                    {ev.cost > 0 && (
                      <p className="text-xs text-success-600 font-medium">
                        +{fmt(ev.quoted - ev.cost)} utilidad
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Sin cotización</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <Link href={`/events/${ev.id}`} className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Ver detalle
              </Link>
              {ev.status !== "CANCELLED" && (
                <Link href={`/events/${ev.id}/quote`} className="rounded-lg bg-brand-50 dark:bg-brand-500/15 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/25 transition-colors">
                  Generar PDF
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
