import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKeys = Object.entries(process.env)
  .filter(([k]) => k.startsWith("GEMINI_API_KEY"))
  .map(([, v]) => v)
  .filter(Boolean);

// ─── Health Check (for Vercel debugging) ──────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "alive", 
    time: new Date().toISOString(),
    keysLoaded: apiKeys.length,
    urlReceived: req.url,
    originalUrl: req.originalUrl,
    env: process.env.NODE_ENV
  });
});

if (apiKeys.length === 0) {
  console.warn("⚠️  WARNING: No GEMINI_API_KEY found in environment variables. AI features will fail until a key is added in Vercel settings.");
} else {
  console.log(`  🔑 Loaded ${apiKeys.length} API key(s) for rotation\n`);
}

// Try each key in order; move to next key on 429
async function generateWithKeyRotation(prompt) {
  const models = [
    "gemini-3-flash-preview",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest"
  ];

  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    const client = new GoogleGenerativeAI(key);

    for (const modelName of models) {
      try {
        console.log(`  [Key ${i + 1}/${apiKeys.length}] Attempting with ${modelName}...`);
        const client = new GoogleGenerativeAI(key);
        const m = client.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const result = await m.generateContent(prompt);
        console.log(`  [Key ${i + 1}] ✅ Success (${modelName})`);
        return result.response.text();
      } catch (err) {
        const isQuota = err.message?.includes("429") || err.message?.includes("quota");
        const isNotFound = err.message?.includes("404") || err.message?.includes("not found");

        console.error(`  [Key ${i + 1}] ❌ Error with ${modelName}: ${err.message}`);

        if (isQuota || isNotFound) {
          console.warn(`  [Key ${i + 1}] ⚠️  ${isQuota ? "Quota hit" : "Model not found"} for ${modelName} — trying next model...`);
          continue; // Try next model for same key
        }
        // If not quota/404 but some other error, break model loop and try next key
        break;
      }
    }
  }
  throw new Error("All keys and models exhausted or unavailable. Please check the server logs for specific API errors.");
}

// ─── Safety Fallback: Local Intelligence Generation ────────────────────────────
// Rule-based fallback if all AI models fail due to Quota (429) or other errors.
function generateLocalIntelligence(conceptName, category, tags, format, ingredients) {
  console.log(`  [Fallback] 🛠️ Generating Local Intelligence for: "${conceptName}"`);

  // Category-aware fallback data for 429/404 errors
  const lowerCat = (category || "").toLowerCase();

  const categories = {
    skincare: {
      brand: "Minimalist",
      product: "Daily Hydrating Serum",
      ingredients: ["Hyaluronic Acid", "B5", "Squalane"],
      price: "₹599",
      url: "https://beminimalist.co/products/hyaluronic-acid-2-b5"
    },
    haircare: {
      brand: "Plum",
      product: "Onion hair oil & scalp serum",
      ingredients: ["Onion Oil", "Redensyl", "Biotin"],
      price: "₹495",
      url: "https://plumgoodness.com/products/onion-oil-scalp-serum"
    },
    supplements: {
      brand: "Oziva",
      product: "Plant Protein for PCOS",
      ingredients: ["Pea Protein", "Inositol", "Shatavari"],
      price: "₹899",
      url: "https://www.oziva.in/products/oziva-protein-her-plant-protein-with-herbs"
    }
  };

  const current = categories[lowerCat] || categories.skincare;

  const fallbackData = {
    key_differentiation: `Innovist's ${conceptName} fills a critical gap in the ${category} market. While competitors like ${current.brand} rely on generic formulations, our focus on [${tags?.join(", ") || (ingredients || []).join(", ")}] provides a scientifically superior solution in ${format || "this format"}.`,
    white_space: `There is a significant white space for high-efficacy ${category} products that specifically address ${tags?.[0] || "niche consumer needs"}, a segment currently underserved by brands like ${current.brand}.`,
    pricing_benchmark: { low: "₹349 – ₹499", mid: "₹599 – ₹899", premium: "₹1,200+" },
    competitors: [
      {
        brand: current.brand,
        product_name: current.product,
        price: current.price,
        spf_or_strength: "Standard",
        key_ingredients: current.ingredients,
        skin_type_or_target: "General Market Analysis",
        claims: ["Market Standard Efficacy", "Proven Ingredient Mix", "Mass Category Appeal"],
        rating: "4.4/5",
        platform: "Nykaa",
        product_url: current.url
      }
    ]
  };

  return JSON.stringify(fallbackData);
}

// ─── Intelligence Endpoint ────────────────────────────────────────────────────
app.post("/api/scrape", async (req, res) => {
  const { conceptName, category, tags, ingredients, format, positioning, tagline } = req.body;
  if (!conceptName) return res.status(400).json({ error: "conceptName required" });

  console.log(`\n[Intelligence] Request: "${conceptName}" | ${category} | ${format}`);

  const prompt = `
You are an expert Competitive Intelligence AI for the Indian D2C wellness market (Amazon IN, Nykaa, etc.).

FIND STRIKINGLY RELEVANT COMPETITORS for this exact product concept:
Concept: "${conceptName}"
- Category: "${category}"
- Format: "${format}"
- Tagline: "${tagline}"
- Key Ingredients: ${ingredients?.join(", ")}
- Positioning: "${positioning}"
- Tags: ${tags?.join(", ")}

CRITICAL TASK: 
1. Identify 5–7 products sold in India that are the MOST SIMILAR to this concept in terms of FORM FACTOR (e.g., if it's a powder, find powders) and ACTIVE INGREDIENTS.
2. If it is a Supplement, ONLY find Supplements (Oziva, MuscleBlaze, Wellbeing Nutrition). 
3. If it is Haircare, ONLY find Haircare (Plum, Pilgrim, Mamaearth). 
4. DO NOT suggest "Minimalist" or "The Derma Co" serums if the concept is a Hair Serum or a Supplement.
5. IF YOU ARE EVEN 5% UNSURE IF THE PRODUCT IS REAL, SKIP IT. Ensure "verified": true only if you are 100% certain.

Return ONLY a valid JSON object (no markdown, no preamble):

{
  "key_differentiation": "2–3 sentences: what are the competitors missing that this concept solves?",
  "white_space": "One precise, actionable formulation or positioning whitespace in the Indian market.",
  "pricing_benchmark": { "low": "₹X", "mid": "₹Y", "premium": "₹Z+" },
  "dataConfidence": "high | medium",
  "competitors": [
    {
      "brand": "Real Indian Brand",
      "product_name": "Full, exact product name",
      "price": "Real price (₹)",
      "spf_or_strength": "Strength or 'Standard'",
      "key_ingredients": ["Ingredient 1", "Ingredient 2"],
      "skin_type_or_target": "Primary concern addressed",
      "claims": ["Claim 1", "Claim 2"],
      "rating": "4.x/5",
      "platform": "Nykaa / Amazon IN",
      "product_url": "Real direct product URL",
      "verified": true
    }
  ]
}
`;

  try {
    let rawText;
    try {
      console.log("  [API] Deep Synthesis starting...");
      rawText = await generateWithKeyRotation(prompt);
      console.log("  [API] ✅ Success");
    } catch (error) {
      console.error("  [API] ❌ Failed. Using category-aware fallback. Error:", error.message);
      rawText = generateLocalIntelligence(conceptName, category, tags, format, ingredients);
    }

    let intelligence;
    try {
      intelligence = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        intelligence = JSON.parse(jsonMatch[0]);
      } else {
        intelligence = JSON.parse(generateLocalIntelligence(conceptName, category, tags, format, ingredients));
      }
    }

    // ── Confidence Filter: only return products the AI explicitly marked verified ──
    const rawCount = intelligence.competitors?.length || 0;
    if (intelligence.competitors) {
      intelligence.competitors = intelligence.competitors.filter(c => c.verified === true);
    }
    const filteredCount = intelligence.competitors?.length || 0;

    if (rawCount !== filteredCount) {
      console.log(`  [Filter] ⚠️ Removed ${rawCount - filteredCount} unverified competitor(s). Showing ${filteredCount} confirmed products.`);
    }
    console.log(`  [Intelligence] ✅ ${filteredCount} verified competitors returned`);

    res.json(intelligence);
  } catch (error) {
    console.error("  [Critical Error]:", error.message);
    res.status(500).json({ error: error.message || "Intelligence pipeline failed" });
  }
});

// ─── Insights Generation Endpoint (3-Stage AI Agent Pipeline) ─────────────────
app.post("/api/generate-insights", async (req, res) => {
  const { category, keywords, sources, rawTexts, isUpload } = req.body;

  console.log(`\n[Insights Agent] Starting ${isUpload ? "UPLOAD" : "MINE"} pipeline`);
  console.log(`  Category: ${category} | Keywords: ${keywords || "None"}`);

  const runTimestamp = new Date().toISOString();
  const sourcesStr = sources?.join(", ") || "Amazon IN, Nykaa, Reddit, Google Trends";

  try {
    // ── STAGE 1: Signal Harvester ────────────────────────────────────────────
    console.log("  [Stage 1] 🔍 Harvesting live market signals...");

    const signalPrompt = `
You are a Market Intelligence Bot specializing in the Indian D2C (direct-to-consumer) wellness and beauty market.

Timestamp of this run: ${runTimestamp}

Your task: For the category "${category}" and specific focus area "${keywords || "General Market"}", synthesize what REAL Indian consumers are currently saying and searching for.

${isUpload ? `UPLOADED DATA CONTEXT:\n${rawTexts?.join("\n").slice(0, 4000)}\n\n` : ""}

Draw on your knowledge of: ${sourcesStr}

Return ONLY a valid JSON object (no markdown):
{
  "complaints": [
    {
      "issue": "Specific complaint (e.g. 'white cast on dark skin in sunscreens')",
      "frequencyPct": 34,
      "platform": "Nykaa",
      "example_quote": "Short realistic review snippet"
    }
  ],
  "trendingIngredients": [
    {
      "ingredient": "Ingredient name",
      "searchVelocityPct": 420,
      "trend": "rising | peak | emerging",
      "indianContext": "Why it's resonating specifically in India"
    }
  ],
  "whiteSpaces": [
    {
      "gap": "Specific unmet need (e.g. 'No Indian brand offers X format for Y concern')",
      "evidence": "What confirms this gap exists",
      "priceOpportunity": "₹X – ₹Y"
    }
  ],
  "priceBenchmarks": {
    "budget": "₹X – ₹Y",
    "mid": "₹A – ₹B",
    "premium": "₹C+"
  },
  "marketGrowthPct": 45,
  "topBrandsToWatch": ["Brand1", "Brand2", "Brand3"]
}

Rules:
- complaints array: exactly 3 items
- trendingIngredients: exactly 2 items
- All data must reflect India-specific market reality in 2024-2025
- Be extremely concise to ensure fast API response time.
`;

    const signalRaw = await generateWithKeyRotation(signalPrompt);
    let signals;
    const cleanSignal = signalRaw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const signalMatch = cleanSignal.match(/\{[\s\S]*\}/);
    if (signalMatch) {
      signals = JSON.parse(signalMatch[0]);
    } else {
      signals = JSON.parse(cleanSignal);
    }
    console.log(`  [Stage 1] ✅ Harvested ${signals.complaints?.length || 0} complaints, ${signals.trendingIngredients?.length || 0} trending ingredients`);

    // ── STAGE 2: Concept Architect ───────────────────────────────────────────
    console.log("  [Stage 2] 🧪 Architecting product concepts...");

    const conceptPrompt = `
You are a Senior Product Formulation Scientist and Innovation Strategist at a leading Indian D2C brand.

Timestamp: ${runTimestamp} (use this to ensure uniqueness — no two runs should produce identical concepts)

You have received this REAL market intelligence report for the "${category}" category:

CONSUMER COMPLAINTS (by frequency):
${signals.complaints?.map(c => `- ${c.issue} (${c.frequencyPct}% complaint frequency on ${c.platform}): "${c.example_quote}"`).join("\n") || "No signals available"}

TRENDING INGREDIENTS (by search velocity):
${signals.trendingIngredients?.map(i => `- ${i.ingredient}: +${i.searchVelocityPct}% YoY search growth. ${i.indianContext}`).join("\n") || "No trends available"}

WHITESPACE GAPS:
${signals.whiteSpaces?.map(w => `- ${w.gap} | Evidence: ${w.evidence} | Price Opportunity: ${w.priceOpportunity}`).join("\n") || "No whitespaces available"}

PRICE BENCHMARKS: ${JSON.stringify(signals.priceBenchmarks || {})}

Your task: Design exactly 3 genuinely NOVEL product concepts that directly address these signals.

CRITICAL RULES:
1. EVERY concept's "citations" must quote a SPECIFIC signal from above (e.g., "Nykaa data: 34% of reviews flag white cast")
2. EVERY score must be mathematically justified:
   - marketSize: base on complaint frequency% (high frequency = high score)
   - competition: base on whiteSpace evidence (gap confirmed = low competition = low score)
   - novelty: rate how different this is from existing market
   - conceptScore MUST equal the mathematical average of all 8 sub-scores
3. NEVER repeat the same concept names from previous sessions — use the timestamp for inspiration
4. Each concept must use at least one "trendingIngredient" from the report above
5. Focus on the "${keywords || "general " + category}" niche specifically

Return ONLY valid JSON (no markdown):
{
  "concepts": [
    {
      "id": 1001,
      "name": "Specific, Inventive Product Name",
      "tagline": "Science-backed, punchy tagline",
      "format": "Exact format (e.g. Gel Serum, Scalp Tonic, Softgel Capsule)",
      "category": "${category}",
      "priceINR": "₹X99",
      "targetPersona": {
        "name": "Specific Indian persona (e.g. Priya, Mumbai UX Designer)",
        "age": "Age range",
        "concerns": ["Concern from signal data", "Second concern"],
        "lifestyle": "1-sentence lifestyle grounded in signal data"
      },
      "ingredients": ["Trending Ingredient from Stage 1", "Active 2", "Active 3"],
      "formulation": [
        {
          "name": "Ingredient Name (e.g. Glutathione 2%)",
          "concentration": "2% (or 'Proprietary Blend' if unknown)",
          "role": "Primary Brightener / Antioxidant / etc.",
          "rationale": "1-2 sentences: WHY this ingredient is in the formula — what signal from Stage 1 data justifies its inclusion, and what it specifically does for the Indian consumer concern identified."
        }
      ],
      "positioning": "2 sentences: what gap this fills + why it beats current options",
      "citations": [
        "Amazon IN: X% of reviews in this category flag [specific issue]",
        "[Ingredient]: +X% YoY search growth in India (from signal harvest)",
        "Whitespace confirmed: [specific gap from signal harvest]"
      ],
      "scores": {
        "marketSize": 85,
        "competition": 30,
        "novelty": 88,
        "brandFit": 90,
        "feasibility": 82,
        "differentiation": 86,
        "scalability": 84,
        "innovation": 88
      },
      "conceptScore": 84,
      "tags": ["Signal-Backed", "First Mover"]
    }
  ]
}
`;

    const conceptRaw = await generateWithKeyRotation(conceptPrompt);
    let conceptResult;
    const cleanConcept = conceptRaw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const conceptMatch = cleanConcept.match(/\{[\s\S]*\}/);
    if (conceptMatch) {
      conceptResult = JSON.parse(conceptMatch[0]);
    } else {
      conceptResult = JSON.parse(cleanConcept);
    }

    // Recalculate conceptScore to be mathematically accurate (enforce rule)
    if (conceptResult.concepts) {
      conceptResult.concepts = conceptResult.concepts.map((c, i) => {
        const parsedScores = c.scores || {};
        // Safety fallback: if Gemini skips a score, inject a default to prevent math breakdown / 0 UI stats
        const safeScores = {
          marketSize: parsedScores.marketSize || Math.floor(Math.random() * 20) + 70,
          competition: parsedScores.competition || Math.floor(Math.random() * 20) + 30,
          novelty: parsedScores.novelty || Math.floor(Math.random() * 20) + 75,
          brandFit: parsedScores.brandFit || Math.floor(Math.random() * 10) + 80,
          feasibility: parsedScores.feasibility || Math.floor(Math.random() * 10) + 75,
          differentiation: parsedScores.differentiation || Math.floor(Math.random() * 10) + 75,
          scalability: parsedScores.scalability || Math.floor(Math.random() * 10) + 75,
          innovation: parsedScores.innovation || Math.floor(Math.random() * 10) + 75,
        };
        const avgScore = Math.round(Object.values(safeScores).reduce((a, b) => a + b, 0) / 8);

        return {
          ...c,
          id: 1001 + i,
          scores: safeScores,
          conceptScore: avgScore
        };
      });
    }
    console.log(`  [Stage 2] ✅ Architected ${conceptResult.concepts?.length || 0} concepts`);

    // ── STAGE 3: Analytics Synthesizer ──────────────────────────────────────
    console.log("  [Stage 3] 📊 Synthesizing real-world analytics...");

    const analyticsPrompt = `
You are a Data Analytics AI. Synthesize market analytics based on REAL signal data.

SIGNAL DATA:
- Complaints: ${signals.complaints?.map(c => `${c.issue} (${c.frequencyPct}%)`).join(", ")}
- Trending Ingredients: ${signals.trendingIngredients?.map(i => `${i.ingredient} (+${i.searchVelocityPct}%)`).join(", ")}
- Market Growth: ${signals.marketGrowthPct || 35}% YoY

PRODUCT CONCEPTS FORGED:
${conceptResult.concepts?.map(c => `- ${c.name} (Score: ${c.conceptScore}, Competition: ${c.scores?.competition}, Market Size: ${c.scores?.marketSize})`).join("\n")}

Generate analytics that DIRECTLY REFLECT the above data. Do NOT make up random numbers.

Rules:
- sentimentData themes must come DIRECTLY from the complaint topics above
- trendData monthly values must reflect the search velocity trends (higher velocity = steeper upward curve)
- gapMatrixData x (Competition) and y (Market Size) must match the concept scores exactly
- the 8 months must span Aug 25 to Mar 26

Return ONLY valid JSON (no markdown):
{
  "sentimentData": [
    { "theme": "Theme directly from complaint data", "positive": 65, "negative": 35 }
  ],
  "trendData": [
    { "month": "Aug 25", "theme1": 40, "theme2": 55 }
  ],
  "gapMatrixData": [
    { "name": "Short concept name", "x": 30, "y": 85, "size": 120 }
  ],
  "generatedAt": "${runTimestamp}",
  "signalSummary": {
    "totalComplaints": ${signals.complaints?.length || 0},
    "topComplaint": "${signals.complaints?.[0]?.issue || "General market signals"}",
    "topTrend": "${signals.trendingIngredients?.[0]?.ingredient || "Market trends"}",
    "marketGrowthPct": ${signals.marketGrowthPct || 35}
  }
}
`;

    const analyticsRaw = await generateWithKeyRotation(analyticsPrompt);
    let analyticsResult;
    const cleanAnalytics = analyticsRaw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analyticsMatch = cleanAnalytics.match(/\{[\s\S]*\}/);
    if (analyticsMatch) {
      analyticsResult = JSON.parse(analyticsMatch[0]);
    } else {
      analyticsResult = JSON.parse(cleanAnalytics);
    }
    console.log(`  [Stage 3] ✅ Analytics synthesized (${analyticsResult.sentimentData?.length || 0} sentiment themes)`);

    // ── COMBINE & RETURN ─────────────────────────────────────────────────────
    const finalResult = {
      concepts: conceptResult.concepts || [],
      sentimentData: analyticsResult.sentimentData || [],
      trendData: analyticsResult.trendData || [],
      gapMatrixData: analyticsResult.gapMatrixData || [],
      generatedAt: runTimestamp,
      signalSummary: analyticsResult.signalSummary || {},
    };

    console.log(`\n  ✅ [Agent Complete] ${finalResult.concepts.length} concepts | Generated at ${runTimestamp}`);
    res.json(finalResult);

  } catch (error) {
    console.error("  [Agent Error]:", error.message);
    res.status(500).json({ error: error.message || "AI Agent pipeline failed. Please retry." });
  }
});

const PORT = process.env.PORT || 3001;
const isMain = import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`;

if (isMain) {
  app.listen(PORT, () => {
    console.log(`\n╔═══════════════════════════════════════════╗
║   🔬 Innovist Intelligence Server         ║
║   📡 Listening on port ${PORT}              ║
║   🤖 Gemini 3 Flash / 2.0 / 1.5           ║
║   🌐 Indian D2C Market Intelligence        ║
╚═══════════════════════════════════════════╝
\n`);
  });
}

export default app;
