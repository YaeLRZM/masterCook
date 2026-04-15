import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nueva cotización — MasterCook" };

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva cotización</h1>
        <p className="text-sm text-gray-500">Asigna platillos y calcula el costo para el evento</p>
      </div>
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-400">EventForm — por implementar</p>
        <p className="text-xs text-gray-400 mt-1">
          Conectar con <code>components/events/EventForm.tsx</code>
        </p>
      </div>
    </div>
  );
}
