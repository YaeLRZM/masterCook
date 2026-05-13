import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            {value}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon size={28} />
        </div>
      </div>

      {trend && (
        <div className="mt-5 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
          {trend}
        </div>
      )}
    </div>
  );
}