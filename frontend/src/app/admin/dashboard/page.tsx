"use client";

import PageHeader from "@/components/common/PageHeader";

import {
  dashboardStats,
  revenueData,
  recentActivities,
} from "@/mocks/admin-dashboard.mock";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  DollarSign,
  Users,
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;

  value: string | number;

  icon: React.ElementType;
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
          <Icon className="h-7 w-7 text-orange-600" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}

      <PageHeader
        title="Dashboard"
        description="Business overview and analytics"
      />

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={`$${dashboardStats.revenue}`}
          icon={DollarSign}
        />

        <StatCard
          title="Employees"
          value={dashboardStats.employees}
          icon={Users}
        />

        <StatCard
          title="Events"
          value={dashboardStats.events}
          icon={CalendarDays}
        />

        <StatCard
          title="Quotations"
          value={dashboardStats.quotations}
          icon={FileText}
        />
      </div>

      {/* CHART + ACTIVITY */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CHART */}

        <Card className="col-span-2 rounded-3xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500">
                Monthly business performance
              </p>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={revenueData}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#ea580c"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#ea580c"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="month"
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ea580c"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVITY */}

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Recent Activity
              </h2>

              <p className="text-sm text-gray-500">
                Latest system actions
              </p>
            </div>

            <div className="space-y-5">
              {recentActivities.map(
                (activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />

                    <div>
                      <p className="text-sm font-medium">
                        {activity.action}
                      </p>

                      <p className="text-xs text-gray-500">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}