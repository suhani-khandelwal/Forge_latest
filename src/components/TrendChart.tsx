import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const LINE_COLORS = [
  "hsl(158, 72%, 22%)",
  "hsl(100, 30%, 40%)",
  "hsl(43, 74%, 58%)",
  "hsl(158, 50%, 55%)",
  "hsl(200, 60%, 45%)",
  "hsl(340, 50%, 50%)",
  "hsl(270, 40%, 50%)",
  "hsl(30, 70%, 50%)",
];

const TrendChart = ({ data }: { data: any[] }) => {
  // Auto-detect data keys (everything except "month")
  const dataKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== "month");
  }, [data]);

  // Derive date range from data for the subtitle
  const dateRange = useMemo(() => {
    if (!data || data.length === 0) return "";
    const first = data[0]?.month || "";
    const last = data[data.length - 1]?.month || "";
    return `${first} – ${last}`;
  }, [data]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-forge">
      <h3 className="font-body font-semibold text-forest mb-1">Search Trend Analysis</h3>
      <p className="text-xs text-muted-foreground font-body mb-6">
        Google Trends Index · India · {dateRange}
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }}
          />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "10px",
              fontSize: "12px",
              fontFamily: "Inter",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", fontFamily: "Inter", paddingTop: "12px" }}
          />
          {dataKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={LINE_COLORS[i % LINE_COLORS.length]}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
