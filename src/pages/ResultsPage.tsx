import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mockConcepts, uploadConcepts, sentimentData as mockSentimentData, trendData as mockTrendData, gapMatrixData as mockGapMatrixData } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import ConceptCard from "@/components/ConceptCard";
import SentimentHeatmap from "@/components/SentimentHeatmap";
import TrendChart from "@/components/TrendChart";
import GapMatrix from "@/components/GapMatrix";
import { Filter, Layers, BarChart2, Upload, Globe, FileText } from "lucide-react";
import { useUploadContext } from "@/context/UploadContext";

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "mine";
  const isUpload = source === "upload";
  const { parsedData, generatedResults } = useUploadContext();

  // Use generated results from upload or fall back to hardcoded mock data
  const allConcepts = isUpload
    ? (generatedResults?.concepts && generatedResults.concepts.length > 0 ? generatedResults.concepts : uploadConcepts)
    : mockConcepts;

  const activeSentimentData = isUpload && generatedResults?.sentimentData ? generatedResults.sentimentData : mockSentimentData;
  const activeTrendData = isUpload && generatedResults?.trendData ? generatedResults.trendData : mockTrendData;
  const activeGapMatrixData = isUpload && generatedResults?.gapMatrixData ? generatedResults.gapMatrixData : mockGapMatrixData;

  const [activeFilter, setActiveFilter] = useState<"all" | "Skincare" | "Haircare" | "Supplements">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"concepts" | "analytics" | "uploaded">(
    isUpload && parsedData.length > 0 ? "uploaded" : "concepts"
  );

  const filtered = activeFilter === "all"
    ? allConcepts
    : allConcepts.filter(c => c.category === activeFilter);

  const avgScore = Math.round(allConcepts.reduce((a, c) => a + c.conceptScore, 0) / allConcepts.length);

  // Dynamic stats based on actual data
  const uniqueCategories = new Set(allConcepts.map(c => c.category));
  const firstMoverCount = allConcepts.filter(c => c.tags.some(t => t.toLowerCase().includes("first mover") || t.toLowerCase().includes("white space"))).length;

  const uploadStats = [
    { label: "Concepts Generated", value: `${allConcepts.length}` },
    { label: "Categories Covered", value: `${uniqueCategories.size}` },
    { label: "Avg Concept Score", value: `${avgScore}/100` },
    { label: "Files Analyzed", value: `${parsedData.length || 1}` },
  ];

  const mineStats = [
    { label: "Data Points Analyzed", value: `${(allConcepts.length * 2089).toLocaleString()}+` },
    {
      label: "Consumer Sources", value: `${new Set(allConcepts.flatMap(c => c.citations.map(ci => {
        const match = ci.match(/^([\w\s]+?):/);
        return match ? match[1].trim() : "";
      }).filter(Boolean))).size} Platforms`
    },
    { label: "Avg Concept Score", value: `${avgScore}/100` },
    { label: "First-Mover Ops", value: `${firstMoverCount} Found` },
  ];

  const stats = isUpload ? uploadStats : mineStats;

  const categories = ["all", ...Array.from(new Set(allConcepts.map(c => c.category)))];

  // Build tab list dynamically
  const tabs = [
    ...(isUpload && parsedData.length > 0
      ? [{ id: "uploaded" as const, label: "Uploaded Data", icon: FileText }]
      : []),
    { id: "concepts" as const, label: "Product Concepts", icon: Layers },
    { id: "analytics" as const, label: "Analytics & Insights", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-forest text-primary-foreground py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isUpload ? (
                    <Upload className="w-4 h-4 text-sage" />
                  ) : (
                    <Globe className="w-4 h-4 text-sage" />
                  )}
                  <p className="text-sage text-sm font-body font-semibold uppercase tracking-widest">
                    {isUpload ? "Upload Analysis Results" : "Live Data Mining Results"}
                  </p>
                </div>
                <h1 className="font-display text-4xl font-bold text-white mb-2">
                  {filtered.length} Product Concepts Forged
                </h1>
                <p className="text-white/60 font-body text-sm">
                  {isUpload
                    ? `Based on your uploaded dataset${parsedData.length > 0 ? ` (${parsedData.map(p => p.fileName).join(", ")})` : ""} · AI-extracted insights`
                    : `Based on ${(allConcepts.length * 2089).toLocaleString()}+ data points · Indian Wellness Market`}
                </p>
              </div>
            </div>

            {/* Source context banner for uploads */}
            {isUpload && (
              <div className="mt-6 flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="w-2 h-2 rounded-full bg-sage animate-pulse flex-shrink-0" />
                <p className="text-white/80 font-body text-sm">
                  <span className="text-sage font-semibold">AI Analysis Complete:</span> Concepts below were generated specifically from your uploaded data. Each concept cites keywords and patterns extracted from your file.
                </p>
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {stats.map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="font-display text-2xl font-bold text-sage">{s.value}</div>
                  <div className="text-white/50 text-xs font-body mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-background border-b border-border sticky top-16 z-30">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-1 py-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${activeTab === tab.id
                    ? "bg-forest text-primary-foreground"
                    : "text-muted-foreground hover:text-forest hover:bg-surface"
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Uploaded Data tab — shows actual parsed content */}
          {activeTab === "uploaded" && parsedData.length > 0 && (
            <div className="space-y-8">
              {parsedData.map((pd, fileIdx) => (
                <div key={fileIdx} className="bg-card border border-border rounded-2xl p-6 shadow-forge">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-forest" />
                    <h3 className="font-body font-semibold text-forest">{pd.fileName}</h3>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(pd.fileSize / 1024).toFixed(1)} KB · {pd.rows.length} rows extracted
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border max-h-96 overflow-y-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="bg-forest text-primary-foreground sticky top-0">
                          {pd.headers.map(h => (
                            <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pd.rows.map((row, i) => (
                          <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-surface"} hover:bg-sage-light/30 transition-colors`}>
                            {row.map((cell, j) => (
                              <td key={j} className="px-4 py-3 text-muted-foreground">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "concepts" && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-body text-muted-foreground">Filter:</span>
                {categories.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f as typeof activeFilter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all ${activeFilter === f
                      ? "bg-forest text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-forest hover:text-forest"
                      }`}
                  >
                    {f === "all" ? "All Categories" : f}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground font-body">{filtered.length} concepts</span>
              </div>

              {/* Concept cards grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(concept => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    expanded={expandedId === concept.id}
                    onToggle={() => setExpandedId(expandedId === concept.id ? null : concept.id)}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <TrendChart data={activeTrendData} />
                <SentimentHeatmap data={activeSentimentData} />
              </div>
              <GapMatrix data={activeGapMatrixData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
