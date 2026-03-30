import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, Lightbulb, TrendingUp, Globe, ExternalLink, Bot, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

interface SubCompetitor {
  brand: string;
  product_name: string;
  price: string;
  spf_or_strength: string;
  key_ingredients: string[];
  skin_type_or_target: string;
  claims: string[];
  rating: string;
  platform: string;
  product_url: string;
}

interface CompetitiveIntelligence {
  competitors: SubCompetitor[];
  key_differentiation: string;
  white_space: string;
  pricing_benchmark: {
    low: string;
    mid: string;
    premium: string;
  };
}

const LoadingState = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 font-body">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-border rounded-full"></div>
      <div className="absolute inset-0 w-20 h-20 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div className="text-center space-y-2">
      <h2 className="font-display text-2xl font-bold text-forest">Mining Market Intelligence</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        Puppeteer is scraping Amazon India live. Gemini AI is synthesizing competitor insights...
      </p>
    </div>
    <div className="flex flex-col gap-2 w-64">
      {["Launching headless browser...", "Scraping Amazon India...", "Extracting prices & ratings...", "Running Gemini analysis..."].map((step, i) => (
        <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
          <Loader2 className="w-3 h-3 text-sage animate-spin flex-shrink-0" />
          {step}
        </div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  const isQuotaError = message.toLowerCase().includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate");
  const isServerDown = message.includes("Cannot reach");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 font-body p-6">
      <div className="p-4 bg-destructive/10 rounded-full">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      <div className="text-center space-y-2 max-w-lg">
        <h2 className="font-display text-2xl font-bold text-foreground">Intelligence Mining Failed</h2>
        <p className="text-muted-foreground text-sm">{message}</p>
        {isQuotaError && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-400 text-left">
            ⚠️ <strong>API Rate Limit Hit:</strong> The free tier has a daily quota. Wait a minute and retry, or check your Google AI Studio dashboard to upgrade.
          </div>
        )}
        {isServerDown && (
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-700 dark:text-blue-400 text-left">
            💡 <strong>Server Offline:</strong> Make sure <code>node server.js</code> is running in a separate terminal.
          </div>
        )}
      </div>
      {!isQuotaError && (
        <button onClick={onRetry} className="flex items-center gap-2 px-5 py-2.5 bg-forest text-primary-foreground rounded-lg font-bold text-sm hover:bg-forest/90 transition-colors">
          <RefreshCw className="w-4 h-4" /> Retry Mining
        </button>
      )}
      {isQuotaError && (
        <button onClick={onRetry} className="flex items-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground rounded-lg font-bold text-sm hover:bg-muted/80 transition-colors">
          <RefreshCw className="w-4 h-4" /> Retry (wait 1 min first)
        </button>
      )}
    </div>
  );
};

export default function IntelligencePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const concept = location.state?.concept;

  const [intelligence, setIntelligence] = useState<CompetitiveIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchIntelligence = async () => {
    if (!concept) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptName: concept.name,
          category: concept.category,
          tags: concept.tags,
          ingredients: concept.ingredients,
          format: concept.format,
          positioning: concept.positioning,
          tagline: concept.tagline,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const data: CompetitiveIntelligence = await response.json();
      setIntelligence(data);
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot reach the Intelligence Server. Make sure you ran 'node server.js' in your terminal.");
      } else {
        setError(err.message || "Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, [retryCount]);

  if (!concept) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body p-6">
        <h2 className="text-xl font-bold text-forest mb-4">No Concept Data Found</h2>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-forest text-primary-foreground font-bold rounded-lg">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => setRetryCount(r => r + 1)} />;
  if (!intelligence) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 font-body animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-forest transition-colors font-bold uppercase tracking-widest"
          >
            Dashboard
          </button>
          <span className="text-muted-foreground/30 text-xs">/</span>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-xs text-forest hover:text-forest-light transition-colors font-bold uppercase tracking-widest"
          >
            Product Concepts
          </button>
          <span className="text-muted-foreground/30 text-xs">/</span>
          <span className="text-xs text-sage font-bold uppercase tracking-widest">
            Competitive Dashboard
          </span>
        </div>
        {/* Header Section */}
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-forest text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  {concept.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-sage">
                  <Bot className="w-4 h-4" />
                  Live Intelligence · Amazon IN · Nykaa · Flipkart · Gemini AI
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-forest">{concept.name}</h1>
              <p className="text-muted-foreground italic mt-1">"{concept.tagline}"</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {concept.tags.map((tag: string) => (
                <span key={tag} className="px-2.5 py-1 bg-surface border border-border text-muted-foreground text-xs rounded shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Strategic Insight Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-sage transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-forest/5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="p-2 bg-surface rounded-lg shadow-sm"><Cpu className="w-5 h-5 text-forest" /></div>
              <h4 className="font-body font-bold text-forest text-sm uppercase tracking-wider">Key Differentiation</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed relative">{intelligence.key_differentiation}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-sage transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="p-2 bg-surface rounded-lg shadow-sm"><Lightbulb className="w-5 h-5 text-forest" /></div>
              <h4 className="font-body font-bold text-forest text-sm uppercase tracking-wider">White Space Insight</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed relative">{intelligence.white_space}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-sage transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-surface rounded-lg shadow-sm"><TrendingUp className="w-5 h-5 text-forest" /></div>
                <h4 className="font-body font-bold text-forest text-sm uppercase tracking-wider">Live Pricing Benchmark</h4>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Premium Cluster", value: intelligence.pricing_benchmark.premium, dot: "bg-forest" },
                  { label: "Mid-Market Core", value: intelligence.pricing_benchmark.mid, dot: "bg-sage" },
                  { label: "Budget Tier", value: intelligence.pricing_benchmark.low, dot: "bg-border" },
                ].map(({ label, value, dot }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${dot}`}></div>{label}
                    </span>
                    <span className="font-bold text-forest text-base">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Table */}
        {/* Live Table */}
        <div className="bg-card border border-border rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-border bg-surface flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-forest" />
              <h3 className="font-body font-bold text-forest text-base">Live Market Intelligence · Amazon India</h3>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground font-body flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <span className="text-amber-500">⚠</span>
                AI-synthesized from market knowledge · Verify prices before decisions
              </span>
              <span className="text-xs text-sage font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse inline-block"></span>
                Confidence-Filtered · {intelligence.competitors?.length || 0} verified products
              </span>
            </div>
          </div>

          {intelligence.competitors?.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-surface/50 border-b border-border text-xs font-bold text-forest uppercase tracking-wider">
                    <th className="py-4 px-5">Brand</th>
                    <th className="py-4 px-5">Product Name</th>
                    <th className="py-4 px-4 w-28">Live Price</th>
                    <th className="py-4 px-4">Strength/SPF</th>
                    <th className="py-4 px-5 w-64">Key Ingredients</th>
                    <th className="py-4 px-5">Target Need</th>
                    <th className="py-4 px-5 w-60">Top Claims</th>
                    <th className="py-4 px-4 w-20">Live Rating</th>
                    <th className="py-4 px-4">Platform</th>
                  </tr>
                </thead>
                <tbody>
                  {intelligence.competitors.map((comp, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-surface transition-colors group">
                      <td className="py-4 px-5 font-bold text-forest whitespace-nowrap text-sm">{comp.brand}</td>
                      <td className="py-4 px-5 text-muted-foreground font-medium text-sm max-w-[200px]">{comp.product_name}</td>
                      <td className="py-4 px-4 text-forest font-bold whitespace-nowrap">{comp.price}</td>
                      <td className="py-4 px-4 text-sage font-bold whitespace-nowrap">{comp.spf_or_strength}</td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1.5">
                          {comp.key_ingredients?.map(ing => (
                            <span key={ing} className="bg-surface border border-border px-2 py-0.5 rounded shadow-sm text-xs font-semibold text-forest">{ing}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground text-sm font-medium">{comp.skin_type_or_target}</td>
                      <td className="py-4 px-5 text-muted-foreground text-xs leading-relaxed">{comp.claims?.join(" • ")}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gold/10 text-forest font-bold border border-gold/20 shadow-sm text-xs">
                          {comp.rating}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground whitespace-nowrap text-xs font-bold uppercase tracking-wider">{comp.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="font-display font-bold text-forest text-lg mb-2">No Confirmed Competitors Found</h4>
              <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
                The AI could not confirm any real competitors for this exact product format with sufficient confidence.
                This may actually signal a strong <span className="text-forest font-semibold">first-mover opportunity</span> — no established product occupies this space yet.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
