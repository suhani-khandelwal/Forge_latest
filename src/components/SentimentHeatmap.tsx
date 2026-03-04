interface SentimentEntry {
  theme: string;
  positive: number;
  negative: number;
}

const SentimentHeatmap = ({ data }: { data: SentimentEntry[] }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-forge">
      <h3 className="font-body font-semibold text-forest mb-1">Sentiment Heatmap</h3>
      <p className="text-xs text-muted-foreground font-body mb-6">Positive vs Negative themes from 50K+ consumer reviews</p>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.theme} className="flex items-center gap-3">
            <span className="text-xs font-body text-muted-foreground w-32 flex-shrink-0">{item.theme}</span>
            <div className="flex-1 flex h-6 rounded-full overflow-hidden gap-px">
              <div
                className="h-full flex items-center justify-end pr-2 transition-all duration-700"
                style={{
                  width: `${item.positive}%`,
                  background: `hsl(${100 + (item.positive - 50) * 0.5}, ${40 + item.positive * 0.3}%, ${35 + item.positive * 0.1}%)`,
                }}
              >
                {item.positive > 50 && (
                  <span className="text-white text-xs font-body font-bold">{item.positive}%</span>
                )}
              </div>
              <div
                className="h-full flex items-center justify-start pl-2 transition-all duration-700"
                style={{
                  width: `${item.negative}%`,
                  background: `hsl(0, ${30 + item.negative * 0.4}%, ${65 - item.negative * 0.1}%)`,
                }}
              >
                {item.negative > 18 && (
                  <span className="text-white text-xs font-body font-bold">{item.negative}%</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6 mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-forest" />
          <span className="text-xs font-body text-muted-foreground">Positive Sentiment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <span className="text-xs font-body text-muted-foreground">Negative Sentiment</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentHeatmap;
