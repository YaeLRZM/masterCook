import {
  Users,
  Building2,
  ShieldCheck,
  Activity,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import StatCard from "@/components/cards/StatCard";

const recentActivity = [
  {
    action: "New company created",
    user: "Master Admin",
    time: "2 min ago",
  },

  {
    action: "User updated permissions",
    user: "Carlos Admin",
    time: "15 min ago",
  },

  {
    action: "Company suspended",
    user: "System",
    time: "1 hour ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}

      <PageHeader
        title="Dashboard"
        description="General platform overview"
      />

      {/* STATS */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Companies"
          value="12"
          icon={Building2}
          trend="+12%"
        />

        <StatCard
          title="Users"
          value="248"
          icon={Users}
          trend="+24%"
        />

        <StatCard
          title="Active Sessions"
          value="180"
          icon={ShieldCheck}
          trend="+8%"
        />

        <StatCard
          title="Audit Logs"
          value="1,245"
          icon={Activity}
          trend="+18%"
        />
      </div>

      {/* BENTO GRID */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* BIG CARD */}

        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white xl:col-span-8">
          <p className="text-sm text-blue-100">
            Platform Analytics
          </p>

          <h2 className="mt-3 text-5xl font-bold tracking-tight">
            98.2%
          </h2>

          <p className="mt-4 max-w-md text-blue-100">
            System uptime and operational
            performance during the last 30
            days.
          </p>

          <div className="mt-10 flex gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">
                Active Companies
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                12
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">
                Active Users
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                210
              </h3>
            </div>
          </div>
        </div>

        {/* SIDE CARD */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 xl:col-span-4">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <div className="mt-6 space-y-5">
            {recentActivity.map(
              (activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />

                  <div>
                    <p className="font-medium">
                      {activity.action}
                    </p>

                    <p className="text-sm text-gray-500">
                      {activity.user}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold">
            Companies
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Company",
                "Users",
                "Status",
                "Plan",
              ].map((item) => (
                <th
                  key={item}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-500"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[
              {
                company: "Master Kitchen",
                users: 24,
                status: "Active",
                plan: "Enterprise",
              },

              {
                company: "Golden Chef",
                users: 12,
                status: "Active",
                plan: "Business",
              },
            ].map((company, index) => (
              <tr
                key={index}
                className="border-t border-gray-100"
              >
                <td className="px-6 py-5 font-medium">
                  {company.company}
                </td>

                <td className="px-6 py-5">
                  {company.users}
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    {company.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  {company.plan}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}