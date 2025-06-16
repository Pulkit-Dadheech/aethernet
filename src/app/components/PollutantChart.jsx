import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

/**
 * PollutantChart displays a responsive bar chart for air pollution data.
 * Props: pm2_5, pm10, no2, co, so2, o3 (all numbers)
 */
const PollutantChart = ({ pm2_5, pm10, no2, co, so2, o3 }) => {
  const data = [
    { name: "PM2.5", value: pm2_5 },
    { name: "PM10", value: pm10 },
    { name: "NO₂", value: no2 },
    { name: "CO", value: co },
    { name: "SO₂", value: so2 },
    { name: "O₃", value: o3 },
  ];

  // Custom Tooltip for better display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg border border-border bg-card px-4 py-2 shadow text-card-foreground"
          style={{
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            fontSize: "0.95rem",
          }}
        >
          <div>
            <span className="font-semibold">{payload[0].payload.name}</span>
          </div>
          <div>
            <span className="font-bold">{payload[0].value}</span>
            <span className="ml-1 text-xs text-muted-foreground">µg/m³</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card rounded-lg shadow-md p-4 mt-8 border border-border transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-primary text-center">Pollutant Levels</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4442" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "µg/m³",
              angle: -90,
              position: "insideLeft",
              fill: "var(--muted-foreground)",
              fontSize: 12,
              dx: -10,
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--primary)", opacity: 0.1 }} />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
            className="transition-all"
          >
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: "var(--primary)", fontWeight: 600, fontSize: 14 }}
              formatter={(value) => `${value} µg/m³`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollutantChart;