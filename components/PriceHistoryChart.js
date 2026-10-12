"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDate, formatDateTime } from "@/lib/utils";

export function PriceHistoryChart({ priceHistory, currency = "₹" }) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="bg-gray-50 flex justify-center items-center rounded-xl h-72">
        <div className="text-center">
          <p className="text-gray-700 font-medium">No price history yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Price changes will appear here after the product is checked.
          </p>
        </div>
      </div>
    );
  }

  const chartData = priceHistory.map((item) => ({
    date: formatDate(item.checked_at),
    fullDate: formatDateTime(item.checked_at),
    price: Number(item.price),
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-50 flex justify-center items-center rounded-xl h-72">
        <div className="text-center">
          <p className="text-gray-700 font-medium">
            No valid price history yet
          </p>
          <p className="text-gray-500 text-sm mt-1">
            A valid price is required to display the chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f1f1"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#9ca3af",
              fontSize: 12,
              dy: 10,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#9ca3af",
              fontSize: 12,
            }}
            tickFormatter={(value) => `${currency}${value}`}
            width={65}
          />

          <Tooltip
            cursor={{
              stroke: "#fed7aa",
              strokeWidth: 1,
            }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }

              const data = payload[0]?.payload;

              return (
                <div className="bg-white border rounded-xl shadow-lg px-4 py-3">
                  <p className="text-gray-500 text-xs">{data.fullDate}</p>
                  <p className="text-orange-500 text-lg font-bold mt-1">
                    {currency} {data.price.toLocaleString("en-IN")}
                  </p>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#f97316",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "#f97316",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
