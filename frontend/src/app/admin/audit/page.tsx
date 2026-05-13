import PageHeader from "@/components/common/PageHeader";

import { auditLogs } from "@/mocks/audit.mock";

import {
  ShieldCheck,
} from "lucide-react";

export default function AuditPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities"
      />

      <div className="space-y-4">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                <ShieldCheck className="h-6 w-6 text-orange-600" />
              </div>

              <div>
                <h3 className="font-semibold">
                  {log.action}
                </h3>

                <p className="text-sm text-gray-500">
                  {log.user} • {log.module}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              {log.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}