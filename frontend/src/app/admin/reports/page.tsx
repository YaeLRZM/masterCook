"use client";

import PageHeader from "@/components/common/PageHeader";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Recipes",
    value: 40,
  },

  {
    name: "Events",
    value: 30,
  },

  {
    name: "Employees",
    value: 20,
  },

  {
    name: "Sales",
    value: 10,
  },
];

const COLORS = [
  "#ea580c",
  "#fb923c",
  "#fdba74",
  "#fed7aa",
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Business analytics overview"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CHART */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">
            System Usage
          </h2>

          <div className="h-[350px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={120}
                >
                  {data.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                {item.name}
              </h3>

              <p className="mt-2 text-4xl font-bold text-orange-600">
                {item.value}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}