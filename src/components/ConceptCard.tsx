import { ProductConcept } from "@/data/mockData";
import { Link } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts";
import { ChevronDown, ChevronUp, Tag, User, FlaskConical, DollarSign, Quote, ArrowRight } from "lucide-react";

const ScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 85 ? "bg-forest text-primary-foreground" : score >= 75 ? "bg-sage text-forest" : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-bold ${color}`}>
      {score}/100
    </span>
  );
};

interface ConceptCardProps {
  concept: ProductConcept;
  expanded: boolean;
  onToggle: () => void;
}

const ConceptCard = ({ concept, expanded, onToggle }: ConceptCardProps) => {
  const radarData = [
    { subject: "Innovation", value: concept.scores.innovation },
    { subject: "Feasibility", value: concept.scores.feasibility },
    { subject: "Differentiation", value: concept.scores.differentiation },
    { subject: "Scalability", value: concept.scores.scalability },
    { subject: "Brand Fit", value: concept.scores.brandFit },
    { subject: "Novelty", value: concept.scores.novelty },
  ];

  const categoryColor = concept.category === "Skincare" ? "bg-sage-light text-forest" : "bg-accent text-accent-foreground";

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-all duration-300 shadow-forge hover:shadow-forge-lg ${expanded ? "border-forest" : "border-border hover:border-sage"}`}>
      {/* Card header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${categoryColor}`}>
            {concept.category}
          </span>
          <ScoreBadge score={concept.conceptScore} />
        </div>

        <h3 className="font-display text-xl font-bold text-forest mb-1">{concept.name}</h3>
        <p className="text-muted-foreground text-sm font-body italic mb-4">"{concept.tagline}"</p>

        {/* Quick stats row */}
        <div className="flex gap-4 text-sm font-body">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FlaskConical className="w-3.5 h-3.5 text-sage" />
            <span>{concept.format}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5 text-sage" />
            <span>{concept.priceINR}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {concept.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface border border-border rounded-md text-xs font-body text-muted-foreground">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Score bars */}
        <div className="mt-5 space-y-2">
          {[
            { label: "Market Size", value: concept.scores.marketSize },
            { label: "Competition", value: concept.scores.competition, invert: true },
            { label: "Novelty Index", value: concept.scores.novelty },
          ].map(({ label, value, invert }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs font-body text-muted-foreground w-24 flex-shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${invert ? (value || 0) < 40 ? "bg-forest" : (value || 0) < 65 ? "bg-sage" : "bg-destructive/70" : "bg-forest"}`}
                  style={{ width: `${value || 0}%` }}
                />
              </div>
              <span className="text-xs font-body text-muted-foreground w-8 text-right">{value || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 py-3 border-t border-border text-sm font-body font-medium text-forest hover:bg-sage-light transition-colors"
      >
        {expanded ? (
          <>Close Concept Brief <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>View Concept Brief <ChevronDown className="w-4 h-4" /></>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border bg-surface px-6 py-6 space-y-6 animate-fade-in">
          {/* Persona */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-forest" />
              <h4 className="font-body font-semibold text-forest text-sm">Target Consumer</h4>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-body font-semibold text-foreground mb-1">{concept.targetPersona.name}</p>
              <p className="text-xs text-muted-foreground mb-2">Age: {concept.targetPersona.age}</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {concept.targetPersona.concerns.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-sage-light text-forest text-xs rounded-full font-body">{c}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">{concept.targetPersona.lifestyle}</p>
            </div>
          </div>

          {/* Ingredients / Formulation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-4 h-4 text-forest" />
              <h4 className="font-body font-semibold text-forest text-sm">
                {concept.formulation?.length ? "Formulation Brief" : "Key Ingredients"}
              </h4>
            </div>

            {concept.formulation?.length ? (
              <div className="space-y-3">
                {concept.formulation.map((item, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-forest text-primary-foreground text-xs rounded-full font-body font-bold">
                        {item.name}
                      </span>
                      <span className="text-xs text-sage font-body font-semibold">{item.concentration}</span>
                      <span className="text-xs text-muted-foreground font-body border border-border rounded px-1.5 py-0.5 ml-auto">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">{item.rationale}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {concept.ingredients.map(ing => (
                  <span key={ing} className="px-3 py-1 bg-forest text-primary-foreground text-xs rounded-full font-body">
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Positioning */}
          <div>
            <h4 className="font-body font-semibold text-forest text-sm mb-2">Competitive Positioning</h4>
            <p className="text-sm text-muted-foreground font-body leading-relaxed bg-card border border-border rounded-xl p-4">
              {concept.positioning}
            </p>
          </div>

          {/* Citations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-4 h-4 text-forest" />
              <h4 className="font-body font-semibold text-forest text-sm">Data Citations</h4>
            </div>
            <div className="space-y-2">
              {concept.citations.map((cite, i) => (
                <div key={i} className="flex gap-2 text-xs font-body text-muted-foreground bg-card border-l-2 border-sage pl-3 py-1.5 rounded-r-lg">
                  {cite}
                </div>
              ))}
            </div>
          </div>

          {/* Radar chart */}
          <div>
            <h4 className="font-body font-semibold text-forest text-sm mb-3">Concept Radar Score</h4>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Outfit" }} />
                <Radar
                  dataKey="value"
                  stroke="hsl(var(--forest))"
                  fill="hsl(var(--forest))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Navigation to Full Screen Intelligence */}
          <div className="pt-4 border-t border-border mt-4">
            <Link 
              to={`/intelligence/${concept.id}`}
              state={{ concept }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-forest text-primary-foreground rounded-xl shadow-md hover:bg-forest/90 transition-all font-body font-bold"
            >
              Analyze Competitive Landscape <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptCard;
