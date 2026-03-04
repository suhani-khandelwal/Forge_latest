import { useState, useEffect, useRef } from "react";
import heroImg from "@/assets/hero-bg.png";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Globe, Sparkles, TrendingUp, Users, Zap, Star, MessageSquare } from "lucide-react";

const liveReviews = [
  { platform: "Amazon IN", user: "Priya_S", text: "Finally a ceramide mist that doesn't pill under makeup. Skin barrier is literally healing.", rating: 5, time: "2m ago", tag: "Skincare" },
  { platform: "Reddit", user: "u/hairloss_survivor", text: "Bhringraj oil with biotin capsules changed my hair fall completely in 6 weeks. Need a serum version!", rating: 5, time: "5m ago", tag: "Haircare" },
  { platform: "Nykaa", user: "sneha.k", text: "Sunscreen that doesn't leave white cast??? I've been searching for this forever. Finally found it.", rating: 5, time: "8m ago", tag: "Skincare" },
  { platform: "Flipkart", user: "anon_buyer", text: "Ashwagandha gummies are out of stock everywhere. When is someone making a proper wellness stack for Indians?", rating: 4, time: "11m ago", tag: "Supplements" },
  { platform: "Reddit", user: "u/desi_skincare", text: "Glutathione serum is the next big thing. Been using Korean brands but nothing for Indian skin tones.", rating: 5, time: "14m ago", tag: "Skincare" },
  { platform: "Amazon IN", user: "meera.r", text: "My scalp is SO dry in winter. Needs something between a lightweight oil and a heavy mask.", rating: 3, time: "17m ago", tag: "Haircare" },
  { platform: "Nykaa", user: "vikram.t", text: "Blue light is destroying my skin working from home. No Indian brand addresses this at all.", rating: 4, time: "20m ago", tag: "Skincare" },
  { platform: "Reddit", user: "u/wellness_hunter", text: "Iron + Vitamin D combo supplement that actually absorbs well — why doesn't this exist in India?", rating: 4, time: "23m ago", tag: "Supplements" },
];

const tagColors: Record<string, string> = {
  Skincare: "bg-sage-light text-forest",
  Haircare: "bg-forest/10 text-forest",
  Supplements: "bg-amber-50 text-amber-700",
};

const platformColors: Record<string, string> = {
  "Amazon IN": "text-orange-500",
  Reddit: "text-rose-500",
  Nykaa: "text-pink-500",
  Flipkart: "text-blue-500",
};

const LiveFeed = () => {
  const [newIndex, setNewIndex] = useState<number | null>(null);
  const [reviews, setReviews] = useState(liveReviews.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setReviews(prev => {
        const next = liveReviews[(prev.length) % liveReviews.length];
        const updated = [next, ...prev.slice(0, 3)];
        setNewIndex(0);
        setTimeout(() => setNewIndex(null), 600);
        return updated;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {reviews.map((r, i) => (
        <div
          key={`${r.user}-${r.time}-${i}`}
          className={`bg-card border border-border rounded-xl p-4 transition-all duration-500 ${i === newIndex ? "border-sage bg-sage-light/20 shadow-forge" : ""}`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold font-body ${platformColors[r.platform] ?? "text-muted-foreground"}`}>{r.platform}</span>
              <span className="text-muted-foreground/30 text-xs">·</span>
              <span className="text-xs text-muted-foreground font-body">{r.user}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${tagColors[r.tag] ?? "bg-muted text-muted-foreground"}`}>{r.tag}</span>
              <span className="text-xs text-muted-foreground font-body">{r.time}</span>
            </div>
          </div>
          <p className="text-sm font-body text-foreground/80 leading-relaxed">{r.text}</p>
          <div className="flex mt-2 gap-0.5">
            {[...Array(r.rating)].map((_, j) => (
              <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-hero"
          style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-hero opacity-80" />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10 pt-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-sage" />
              <span className="text-white/80 text-sm font-body">Powered by AI · Built for Mosaic Wellness</span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Where Consumer Data<br />
              <span className="text-sage">Becomes Innovation.</span>
            </h1>

            <p className="text-white/70 text-xl font-body font-light mb-10 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Forge transforms raw market signals, reviews, trends and forums into actionable product concepts for skincare, haircare and supplements that win.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white text-forest font-body font-semibold rounded-xl hover:bg-white/95 transition-all shadow-forge-lg hover:shadow-glow hover:-translate-y-0.5 group"
              >
                <Database className="w-4 h-4" />
                Upload Trends & Data
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/mine"
                className="inline-flex items-center gap-2 px-7 py-4 bg-transparent text-white font-body font-semibold rounded-xl border border-white/40 hover:bg-white/10 transition-all group"
              >
                <Globe className="w-4 h-4" />
                Mine Live Internet Data
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-10 bg-white/40 animate-pulse" />
          <span className="text-white/50 text-xs font-body">scroll</span>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 bg-forest">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Data Sources Mined" },
              { value: "10", label: "Concepts Per Analysis" },
              { value: "3", label: "Product Categories" },
              { value: "100%", label: "Data-Backed Briefs" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-sage mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage font-body font-semibold text-sm uppercase tracking-widest mb-3">The Pipeline</p>
            <h2 className="font-display text-4xl font-bold text-forest">From Signal to Product Brief</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                step: "01",
                title: "Ingest Data",
                desc: "Upload CSVs, PDFs, or connect live sources — Amazon reviews, Reddit forums, Google Trends.",
                color: "bg-sage-light",
                iconColor: "text-forest",
              },
              {
                icon: Zap,
                step: "02",
                title: "AI Analysis",
                desc: "Sentiment analysis, gap mapping, competitive benchmarking, and trend extraction in seconds.",
                color: "bg-forest",
                iconColor: "text-sage",
              },
              {
                icon: TrendingUp,
                step: "03",
                title: "Forge Concepts",
                desc: "Get 7–10 scored product concepts with full PM briefs, formulation direction, and pricing.",
                color: "bg-sage-light",
                iconColor: "text-forest",
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-card border border-border rounded-2xl p-8 shadow-forge hover:shadow-forge-lg transition-all hover:-translate-y-1 group">
                <div className="absolute top-6 right-6 font-display text-5xl font-bold text-muted/40">{item.step}</div>
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-forest mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feed Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-sage font-body font-semibold text-sm uppercase tracking-widest mb-3">Real-Time Signals</p>
              <h2 className="font-display text-4xl font-bold text-forest mb-6">Live Consumer Reviews</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                Forge continuously monitors reviews, forums and trend data from across the Indian wellness market. Every signal feeds directly into product concept generation.
              </p>
              <div className="flex items-center gap-3 p-4 bg-sage-light border border-sage/30 rounded-xl mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-body text-forest font-semibold">Live feed active</span>
                <span className="text-xs text-muted-foreground ml-auto">Amazon · Nykaa · Flipkart · Reddit</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Reviews Processed", value: "2.4M+" },
                  { label: "Signals Today", value: "18,400" },
                  { label: "New Trends", value: "34" },
                ].map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="font-display text-2xl font-bold text-forest">{s.value}</div>
                    <div className="text-xs text-muted-foreground font-body mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <LiveFeed />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage font-body font-semibold text-sm uppercase tracking-widest mb-3">Intelligence Layer</p>
            <h2 className="font-display text-4xl font-bold text-forest">What Forge Delivers</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Consumer Persona Cards", desc: "AI-generated buyer profiles with age, concerns, and lifestyle insights." },
              { icon: TrendingUp, title: "Trend Analysis", desc: "Google Trends-style visualizations showing search momentum over time." },
              { icon: Zap, title: "Competitive Gap Matrix", desc: "X/Y scatter plot revealing blue-ocean opportunities in the market." },
              { icon: Sparkles, title: "Sentiment Heatmap", desc: "Visual breakdown of positive vs negative themes from consumer reviews." },
              { icon: Database, title: "Scoring Engine", desc: "Multi-dimensional concept scoring: market size, novelty, brand fit." },
              { icon: Globe, title: "Live Data Mining", desc: "Real-time signals from Nykaa, Amazon, Flipkart, Reddit India." },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:border-sage transition-all hover:shadow-forge group">
                <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-4 group-hover:bg-forest transition-colors">
                  <f.icon className="w-5 h-5 text-forest group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-body font-semibold text-forest mb-2">{f.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-hero relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-display text-5xl font-bold text-white mb-6">Ready to Forge?</h2>
          <p className="text-white/60 text-lg font-body mb-10 max-w-lg mx-auto">
            Upload your dataset and get AI-powered product concepts in minutes.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-forest font-body font-semibold rounded-xl hover:bg-sage-light transition-all shadow-forge-lg hover:-translate-y-0.5"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-forest border-t border-white/10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white text-lg tracking-wider">FORGE</span>
            <span className="text-white/30 text-sm">by Mosaic Wellness</span>
          </div>
          <p className="text-white/30 text-sm font-body">AI-Powered Product Intelligence</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
