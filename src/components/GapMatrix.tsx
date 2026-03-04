import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, ReferenceLine
} from "recharts";

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="hsl(var(--forest))" fillOpacity={0.15} stroke="hsl(var(--forest))" strokeWidth={2} />
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize={10} fontFamily="Inter" fill="hsl(var(--forest))" fontWeight={600}>
        {payload.name.length > 14 ? payload.name.substring(0, 14) + "…" : payload.name}
      </text>
    </g>
  );
};

const GapMatrix = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-forge">
      <h3 className="font-body font-semibold text-forest mb-1">Competitive Gap Matrix</h3>
      <p className="text-xs text-muted-foreground font-body mb-2">
        X-axis: Competition Intensity · Y-axis: Unmet Consumer Demand
      </p>
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-forest opacity-50" />
          <span className="text-xs font-body text-muted-foreground">Blue Ocean (Low competition, High demand)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive opacity-50" />
          <span className="text-xs font-body text-muted-foreground">Red Ocean (High competition)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }}
          >
            <Label value="Competition Intensity →" offset={-10} position="insideBottom" style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            domain={[60, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }}
          >
            <Label value="Unmet Demand →" angle={-90} position="insideLeft" style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }} />
          </YAxis>
          <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="4 4" />
          <ReferenceLine y={80} stroke="hsl(var(--border))" strokeDasharray="4 4" />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-xl p-3 shadow-forge text-sm font-body">
                    <p className="font-semibold text-forest">{d.name}</p>
                    <p className="text-muted-foreground text-xs">Competition: {d.x}/100</p>
                    <p className="text-muted-foreground text-xs">Demand: {d.y}/100</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            data={data}
            shape={<CustomDot />}
          />
        </ScatterChart>
      </ResponsiveContainer>
      {/* Quadrant labels */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="text-center p-2 bg-forest/5 rounded-lg">
          <span className="text-xs font-body font-semibold text-forest">🌊 Blue Ocean</span>
          <p className="text-xs text-muted-foreground">Low competition · High demand</p>
        </div>
        <div className="text-center p-2 bg-destructive/5 rounded-lg">
          <span className="text-xs font-body font-semibold text-destructive">🔴 Red Ocean</span>
          <p className="text-xs text-muted-foreground">High competition · Crowded</p>
        </div>
      </div>
    </div>
  );
};

export default GapMatrix;
