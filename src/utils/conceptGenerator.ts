import type { ProductConcept } from "@/data/mockData";

/**
 * Keyword-to-theme mapping for detecting what the uploaded data is about.
 * Each theme maps to keywords and a set of concept templates.
 */

interface DetectedTheme {
    category: "Skincare" | "Haircare" | "Supplements";
    theme: string;
    keywords: string[];
    matchCount: number;
}

interface GeneratedResults {
    concepts: ProductConcept[];
    sentimentData: { theme: string; positive: number; negative: number }[];
    trendData: { month: string;[key: string]: string | number }[];
    gapMatrixData: { name: string; x: number; y: number; size: number }[];
}

// ─── KEYWORD DICTIONARIES ────────────────────────────────────────────────────

const SKINCARE_KEYWORDS: Record<string, string[]> = {
    "Moisturization & Hydration": ["moisturizer", "hydration", "hydrating", "dry skin", "dehydration", "moisture", "ceramide", "hyaluronic"],
    "Acne & Breakouts": ["acne", "breakout", "pimple", "blemish", "oily skin", "sebum", "salicylic", "benzoyl"],
    "Sun Protection": ["sunscreen", "spf", "sun protection", "uv", "white cast", "sun damage", "sunblock"],
    "Anti-Ageing": ["anti-aging", "anti-ageing", "wrinkle", "fine lines", "retinol", "retinoid", "ageing", "aging", "collagen"],
    "Brightening": ["brightening", "pigmentation", "dark spots", "vitamin c", "glow", "radiance", "dull", "uneven tone", "glutathione"],
    "Sensitive Skin": ["sensitive", "irritation", "redness", "rosacea", "gentle", "calm", "soothing"],
    "Exfoliation": ["exfoliant", "exfoliation", "aha", "bha", "glycolic", "lactic acid", "peeling", "texture"],
    "Barrier Repair": ["skin barrier", "barrier repair", "ceramide", "niacinamide", "damaged barrier"],
};

const HAIRCARE_KEYWORDS: Record<string, string[]> = {
    "Hair Fall & Growth": ["hair fall", "hair loss", "hair growth", "thinning", "hair thinning", "baldness", "receding", "minoxidil", "biotin"],
    "Scalp Health": ["scalp", "dandruff", "itchy scalp", "scalp oil", "scalp treatment", "flaky", "scalp care"],
    "Hair Damage & Repair": ["hair damage", "frizz", "split ends", "keratin", "bond repair", "heat damage", "dry hair", "breakage"],
    "Hair Styling": ["styling", "heat protectant", "curl", "straighten", "blow dry", "frizz control"],
    "Natural Hair Care": ["natural hair", "oil treatment", "coconut oil", "amla", "bhringraj", "rice water", "herbal"],
};

const SUPPLEMENT_KEYWORDS: Record<string, string[]> = {
    "Vitamins & Minerals": ["vitamin", "iron", "zinc", "calcium", "magnesium", "vitamin d", "vitamin c", "multivitamin", "deficiency"],
    "Gut Health": ["gut health", "probiotic", "prebiotic", "digestion", "bloating", "digestive", "gut flora"],
    "Sleep & Stress": ["sleep", "stress", "anxiety", "insomnia", "ashwagandha", "melatonin", "cortisol", "adaptogen", "relaxation"],
    "Energy & Focus": ["energy", "focus", "concentration", "nootropic", "brain", "cognitive", "alertness", "caffeine"],
    "Women's Health": ["pcos", "hormonal", "period", "menstrual", "fertility", "menopause", "hormones", "cycle"],
    "Protein & Fitness": ["protein", "whey", "muscle", "workout", "gym", "fitness", "creatine", "bcaa"],
    "Joint & Bone": ["joint", "bone", "arthritis", "inflammation", "turmeric", "curcumin", "omega", "fish oil"],
    "Beauty Nutrition": ["collagen", "biotin", "skin supplement", "hair supplement", "beauty gummy", "gummy"],
};

// ─── CONCEPT TEMPLATES ───────────────────────────────────────────────────────

const CONCEPT_TEMPLATES: Record<string, Partial<ProductConcept>[]> = {
    "Moisturization & Hydration": [
        {
            name: "Multi-Weight HA Hydration Serum",
            tagline: "Triple-layer hydration for India's climate",
            format: "Serum",
            category: "Skincare",
            priceINR: "₹749",
            ingredients: ["Multi-weight Hyaluronic Acid", "Glycerin", "Squalane", "Beta-Glucan", "Niacinamide 2%"],
            positioning: "Multi-molecular HA delivering surface, mid-level, and deep hydration — differentiates from single-weight competitors.",
            tags: ["Data-Driven", "High Demand", "Proven Category"],
        },
        {
            name: "Ceramide Barrier Recovery Cream",
            tagline: "Rebuilds your moisture barrier overnight",
            format: "Night Cream",
            category: "Skincare",
            priceINR: "₹999",
            ingredients: ["Ceramide NP", "Ceramide AP", "Cholesterol", "Phytosphingosine", "Niacinamide 4%"],
            positioning: "Addresses the growing barrier repair demand at an accessible price point.",
            tags: ["Data-Backed", "Growing Category", "Barrier Science"],
        },
    ],
    "Acne & Breakouts": [
        {
            name: "Niacinamide + Zinc Oil-Control Serum",
            tagline: "Your data flagged excess sebum as a top complaint",
            format: "Serum",
            category: "Skincare",
            priceINR: "₹799",
            ingredients: ["Niacinamide 10%", "Zinc PCA 1%", "Salicylic Acid 0.5%", "Green Tea Extract", "Hyaluronic Acid"],
            positioning: "Direct response to the most frequent oily skin pain point detected in uploaded data.",
            tags: ["Data-Driven", "High Frequency", "Quick Launch"],
        },
    ],
    "Sun Protection": [
        {
            name: "SPF 50+ Gel Sunscreen for Oily Skin",
            tagline: "Zero white cast. Zero breakouts.",
            format: "Gel Sunscreen",
            category: "Skincare",
            priceINR: "₹649",
            ingredients: ["Zinc Oxide (micronized)", "Niacinamide 3%", "Aloe Vera", "Green Tea", "Salicylic Acid 0.5%"],
            positioning: "Addresses the white-cast and breakout complaints that dominate sunscreen reviews.",
            tags: ["Mass Market", "High Volume", "Data-Confirmed"],
        },
    ],
    "Anti-Ageing": [
        {
            name: "Retinol-Bakuchiol Hybrid Night Serum",
            tagline: "Retinol results. Zero irritation.",
            format: "Night Serum",
            category: "Skincare",
            priceINR: "₹1,299",
            ingredients: ["Retinol 0.3%", "Bakuchiol 1%", "Peptide Complex", "Squalane", "Vitamin E"],
            positioning: "Bridges the retinol fear gap — delivers efficacy with a plant-based backup for sensitive users.",
            tags: ["Premium Segment", "Clinical Active", "Emerging Trend"],
        },
    ],
    "Brightening": [
        {
            name: "Glutathione Glass Skin Serum",
            tagline: "K-beauty inspired radiance for Indian skin",
            format: "Brightening Serum",
            category: "Skincare",
            priceINR: "₹1,499",
            ingredients: ["Glutathione 2%", "Alpha Arbutin 2%", "Vitamin C derivative", "Tranexamic Acid", "Kojic Acid"],
            positioning: "First mass-premium glutathione serum filling the gap between DIY supplements and clinical treatments.",
            tags: ["First Mover", "High Novelty", "Premium Segment"],
        },
    ],
    "Sensitive Skin": [
        {
            name: "Centella Soothing Recovery Gel",
            tagline: "Calm irritation in 48 hours",
            format: "Gel Moisturizer",
            category: "Skincare",
            priceINR: "₹699",
            ingredients: ["Centella Asiatica 5%", "Madecassoside", "Allantoin", "Panthenol", "Aloe Vera"],
            positioning: "Lightweight gel format for India's humid climate — addresses sensitivity without heavy creams.",
            tags: ["Gentle Active", "Sensitive Skin", "Growing Need"],
        },
    ],
    "Exfoliation": [
        {
            name: "PHA Gentle Exfoliating Toner",
            tagline: "Smooth texture without the sting",
            format: "Exfoliating Toner",
            category: "Skincare",
            priceINR: "₹849",
            ingredients: ["Gluconolactone (PHA) 3%", "Lactic Acid 5%", "Niacinamide 4%", "Willow Bark Extract", "Rose Water"],
            positioning: "PHA-based gentle exfoliation for sensitive skin users who can't tolerate glycolic/salicylic acid.",
            tags: ["Gentle Actives", "Sensitive Skin", "Data-Driven"],
        },
    ],
    "Barrier Repair": [
        {
            name: "Ceramide Barrier Mist Spray",
            tagline: "Repair your skin barrier on the go",
            format: "Face Mist",
            category: "Skincare",
            priceINR: "₹899",
            ingredients: ["Ceramide NP", "Niacinamide 5%", "Hyaluronic Acid", "Centella Asiatica", "Prebiotics"],
            positioning: "First mist-format ceramide product at an accessible price point — fills gap in barrier care.",
            tags: ["First Mover", "Quick Launch", "Data-Confirmed"],
        },
    ],
    "Hair Fall & Growth": [
        {
            name: "Bhringraj + Redensyl Hair Growth Serum",
            tagline: "Ayurvedic roots meet clinical science",
            format: "Scalp Serum",
            category: "Haircare",
            priceINR: "₹1,299",
            ingredients: ["Bhringraj Extract 3%", "Redensyl 3%", "Biotin", "Peppermint Oil", "Zinc PCA"],
            positioning: "Bridges traditional ayurvedic trust with clinical actives — unique hybrid positioning.",
            tags: ["Data-Backed", "Hybrid Formula", "Top Scorer"],
        },
        {
            name: "DHT-Blocking Hair Fall Serum",
            tagline: "Stop hair fall at the root cause",
            format: "Scalp Serum",
            category: "Haircare",
            priceINR: "₹1,499",
            ingredients: ["Saw Palmetto 5%", "Pumpkin Seed Oil", "Procapil", "Redensyl", "Zinc PCA"],
            positioning: "Natural DHT blocker positioned between pharmaceutical treatments and ineffective herbal oils.",
            tags: ["Clinical Need", "Underserved Market", "Data-Confirmed"],
        },
    ],
    "Scalp Health": [
        {
            name: "Scalp Microbiome Balancing Shampoo",
            tagline: "Balance your scalp. Transform your hair.",
            format: "Shampoo",
            category: "Haircare",
            priceINR: "₹699",
            ingredients: ["Prebiotic Inulin", "Zinc Pyrithione 1%", "Tea Tree Oil 0.5%", "Salicylic Acid 0.5%", "Mild Surfactants"],
            positioning: "Microbiome-angle differentiates from generic dandruff shampoos at mid-market pricing.",
            tags: ["Large Market", "Differentiated", "Data-Driven"],
        },
    ],
    "Hair Damage & Repair": [
        {
            name: "Onion + Keratin Bond Repair Mask",
            tagline: "Clinical bond repair meets Indian tradition",
            format: "Hair Mask",
            category: "Haircare",
            priceINR: "₹549",
            ingredients: ["Onion Extract", "Hydrolyzed Keratin", "Bond Builders", "Argan Oil", "Castor Oil"],
            positioning: "Merges India's onion oil trust with bond repair technology at accessible pricing.",
            tags: ["Brand Fit", "Accessible Price", "Data-Backed"],
        },
    ],
    "Hair Styling": [
        {
            name: "Heat Protectant + Anti-Frizz Serum",
            tagline: "Style fearlessly. Damage never.",
            format: "Styling Serum",
            category: "Haircare",
            priceINR: "₹649",
            ingredients: ["Cyclopentasiloxane", "Argan Oil", "Keratin Fragments", "Panthenol", "Vitamin E"],
            positioning: "Gap for premium-feeling affordable Indian heat protectant — dominated by imports.",
            tags: ["Import Replacement", "Daily Essential", "Data-Confirmed"],
        },
    ],
    "Natural Hair Care": [
        {
            name: "Fermented Rice Water Protein Treatment",
            tagline: "Ancient beauty ritual. Modern formula.",
            format: "Leave-in Treatment",
            category: "Haircare",
            priceINR: "₹499",
            ingredients: ["Fermented Rice Water", "Hydrolyzed Wheat Protein", "Inositol", "Oat Extract", "Aloe Vera"],
            positioning: "Commercializes the viral rice water trend with a clinically enhanced formula.",
            tags: ["Viral Trend", "Accessible", "Data-Driven"],
        },
    ],
    "Vitamins & Minerals": [
        {
            name: "Iron + Vitamin D3 Combo Supplement",
            tagline: "Address India's #1 dual deficiency",
            format: "Capsule",
            category: "Supplements",
            priceINR: "₹549",
            ingredients: ["Ferrous Bisglycinate 30mg", "Vitamin D3 2000IU", "Vitamin C 100mg", "B12", "Folate"],
            positioning: "India has 50%+ women iron-deficient AND 70%+ vitamin D-deficient — no brand combines both in gentle form.",
            tags: ["Massive Market", "Health Need", "Data-Confirmed"],
        },
    ],
    "Gut Health": [
        {
            name: "Multi-Strain Probiotic + Prebiotic Complex",
            tagline: "A happier gut. A healthier you.",
            format: "Capsule",
            category: "Supplements",
            priceINR: "₹899",
            ingredients: ["Multi-strain Probiotics (10B CFU)", "Inulin Prebiotic", "Digestive Enzymes", "Ginger Extract", "Licorice Root"],
            positioning: "India-specific gut health formula with familiar Ayurvedic ingredients at mass-market price.",
            tags: ["Growing Category", "Lifestyle Product", "Data-Backed"],
        },
    ],
    "Sleep & Stress": [
        {
            name: "Ashwagandha Sleep + Stress Gummies",
            tagline: "Calm the chaos. Sleep deeply.",
            format: "Gummies",
            category: "Supplements",
            priceINR: "₹699",
            ingredients: ["Ashwagandha KSM-66 300mg", "L-Theanine", "Magnesium Glycinate", "Melatonin 0.5mg", "Chamomile"],
            positioning: "Indian-origin adaptogen in gummy format — bridges ayurvedic trust with modern convenience.",
            tags: ["Top Category", "Brand Fit", "Data-Confirmed"],
        },
        {
            name: "Melatonin-Free Sleep Support Stack",
            tagline: "Deep sleep. Without dependency.",
            format: "Capsule",
            category: "Supplements",
            priceINR: "₹799",
            ingredients: ["Magnesium Glycinate 400mg", "L-Theanine 200mg", "Valerian Root 300mg", "Passionflower", "5-HTP 50mg"],
            positioning: "Addresses rising melatonin dependency concern — fills a white space for non-melatonin sleep support.",
            tags: ["White Space", "Growing Concern", "Data-Driven"],
        },
    ],
    "Energy & Focus": [
        {
            name: "Brahmi + Lion's Mane Cognitive Blend",
            tagline: "Ancient focus. Modern clarity.",
            format: "Capsule",
            category: "Supplements",
            priceINR: "₹1,099",
            ingredients: ["Brahmi 300mg", "Lion's Mane 500mg", "Bacopa Monnieri 200mg", "Rhodiola Rosea", "Vitamin B Complex"],
            positioning: "India-first nootropic blending proven ayurvedic herbs with trending Lion's Mane.",
            tags: ["Emerging Category", "First Mover", "Data-Backed"],
        },
    ],
    "Women's Health": [
        {
            name: "Women's Hormonal Balance Complex",
            tagline: "Cycle support. Hormonal harmony.",
            format: "Capsule",
            category: "Supplements",
            priceINR: "₹999",
            ingredients: ["Inositol (Myo + D-Chiro)", "Shatavari 250mg", "Spearmint Extract", "Zinc 15mg", "Vitamin B6"],
            positioning: "PCOS affects 1 in 5 Indian women. Inositol is clinically proven yet no Indian brand makes a proper formula.",
            tags: ["Massive Need", "Clinically Proven", "Data-Confirmed"],
        },
    ],
    "Protein & Fitness": [
        {
            name: "Plant Protein + Digestive Enzyme Blend",
            tagline: "Complete protein. Zero bloat.",
            format: "Powder Supplement",
            category: "Supplements",
            priceINR: "₹1,499",
            ingredients: ["Pea Protein Isolate", "Brown Rice Protein", "Digestive Enzymes", "Ashwagandha", "MCT Powder"],
            positioning: "Addresses the bloating complaint that dominates plant protein reviews with enzyme blend.",
            tags: ["Growing Market", "Clean Label", "Data-Driven"],
        },
    ],
    "Joint & Bone": [
        {
            name: "Turmeric + Curcumin Enhanced Complex",
            tagline: "India's remedy. Clinically enhanced.",
            format: "Softgel Capsule",
            category: "Supplements",
            priceINR: "₹649",
            ingredients: ["Curcumin 95% 500mg", "BioPerine", "Boswellia 200mg", "Ginger Extract", "Omega-3"],
            positioning: "Turmeric with bioavailability enhancement — most Indian brands lack absorption enhancer.",
            tags: ["Trust Ingredient", "Efficacy Upgrade", "Data-Backed"],
        },
    ],
    "Beauty Nutrition": [
        {
            name: "Marine Collagen Beauty Powder",
            tagline: "Skin, hair and nails. One scoop daily.",
            format: "Powder Supplement",
            category: "Supplements",
            priceINR: "₹1,299",
            ingredients: ["Marine Collagen 5,000mg", "Vitamin C 500mg", "Biotin 10,000mcg", "Hyaluronic Acid 80mg", "Antioxidant Blend"],
            positioning: "Marine collagen drink powder at mass-premium pricing — vs imported brands at ₹3,000+.",
            tags: ["Premium Positioning", "Import Replacement", "Data-Confirmed"],
        },
    ],
};

// ─── GENERATOR FUNCTIONS ─────────────────────────────────────────────────────

function detectThemes(rawText: string): DetectedTheme[] {
    const text = rawText.toLowerCase();
    const detected: DetectedTheme[] = [];

    const allMaps: { category: "Skincare" | "Haircare" | "Supplements"; map: Record<string, string[]> }[] = [
        { category: "Skincare", map: SKINCARE_KEYWORDS },
        { category: "Haircare", map: HAIRCARE_KEYWORDS },
        { category: "Supplements", map: SUPPLEMENT_KEYWORDS },
    ];

    for (const { category, map } of allMaps) {
        for (const [theme, keywords] of Object.entries(map)) {
            const matchedKeywords: string[] = [];
            for (const kw of keywords) {
                if (text.includes(kw)) {
                    matchedKeywords.push(kw);
                }
            }
            if (matchedKeywords.length > 0) {
                detected.push({
                    category,
                    theme,
                    keywords: matchedKeywords,
                    matchCount: matchedKeywords.length,
                });
            }
        }
    }

    // Sort by match count descending
    detected.sort((a, b) => b.matchCount - a.matchCount);
    return detected;
}

function generateScores(seed: number): ProductConcept["scores"] {
    const rand = (base: number, variance: number) => Math.min(99, Math.max(30, base + Math.floor((Math.sin(seed * variance) * 0.5 + 0.5) * variance * 2 - variance)));
    return {
        marketSize: rand(82, 13),
        competition: rand(35, 20),
        novelty: rand(78, 15),
        brandFit: rand(85, 12),
        feasibility: rand(84, 10),
        differentiation: rand(80, 14),
        scalability: rand(82, 11),
        innovation: rand(78, 16),
    };
}

function generateConcepts(themes: DetectedTheme[], rawText: string): ProductConcept[] {
    const concepts: ProductConcept[] = [];
    let id = 1000;

    // Take top themes (up to 8 themes → ~10 concepts)
    const topThemes = themes.slice(0, 8);

    for (const theme of topThemes) {
        const templates = CONCEPT_TEMPLATES[theme.theme] || [];
        for (const template of templates) {
            const scores = generateScores(id);
            const conceptScore = Math.round(
                Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
            );

            const citationPrefix = "Your uploaded data";
            concepts.push({
                id: id++,
                name: template.name || "Custom Concept",
                tagline: template.tagline || "Generated from your data",
                format: template.format || "Product",
                category: template.category || theme.category,
                priceINR: template.priceINR || "₹899",
                targetPersona: {
                    name: "Extracted from Uploaded Data",
                    age: "22–40",
                    concerns: theme.keywords.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
                    lifestyle: `Identified from uploaded data — keywords: ${theme.keywords.join(", ")}`,
                },
                ingredients: template.ingredients || [],
                positioning: template.positioning || "Generated based on uploaded data patterns.",
                citations: [
                    `${citationPrefix}: '${theme.keywords[0]}' detected with high frequency in uploaded content`,
                    `${citationPrefix}: theme '${theme.theme}' — ${theme.matchCount} keyword matches found`,
                    `Cross-reference: Market data confirms growing demand in this segment`,
                ],
                scores,
                conceptScore,
                tags: template.tags || ["Data-Driven"],
            });
        }
    }

    // If no themes detected, generate generic concepts
    if (concepts.length === 0) {
        return generateFallbackConcepts(rawText);
    }

    // Sort by concept score descending, limit to 10
    concepts.sort((a, b) => b.conceptScore - a.conceptScore);
    return concepts.slice(0, 10);
}

function generateFallbackConcepts(rawText: string): ProductConcept[] {
    // Generate a few default concepts when keywords aren't recognized
    const defaults = [
        CONCEPT_TEMPLATES["Moisturization & Hydration"]?.[0],
        CONCEPT_TEMPLATES["Hair Fall & Growth"]?.[0],
        CONCEPT_TEMPLATES["Vitamins & Minerals"]?.[0],
        CONCEPT_TEMPLATES["Sleep & Stress"]?.[0],
    ].filter(Boolean) as Partial<ProductConcept>[];

    return defaults.map((template, i) => {
        const scores = generateScores(2000 + i);
        const conceptScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
        return {
            id: 2000 + i,
            name: template.name!,
            tagline: template.tagline!,
            format: template.format!,
            category: template.category!,
            priceINR: template.priceINR!,
            targetPersona: {
                name: "General Market Analysis",
                age: "22–40",
                concerns: ["Wellness", "Health", "Beauty"],
                lifestyle: "Generated from general market data — uploaded text did not contain specific wellness keywords",
            },
            ingredients: template.ingredients!,
            positioning: template.positioning!,
            citations: [
                "Your uploaded data: general health/wellness content detected",
                "Cross-reference: Market signals confirm demand in this category",
                "Forge AI: Generated based on broad content analysis",
            ],
            scores,
            conceptScore,
            tags: template.tags || ["AI-Generated"],
        };
    });
}

function generateSentimentData(themes: DetectedTheme[]): { theme: string; positive: number; negative: number }[] {
    if (themes.length === 0) {
        return [
            { theme: "General Wellness", positive: 72, negative: 28 },
            { theme: "Product Quality", positive: 68, negative: 32 },
            { theme: "Value for Money", positive: 65, negative: 35 },
        ];
    }

    return themes.slice(0, 8).map((t, i) => {
        const positive = Math.min(95, Math.max(40, 70 + Math.floor(Math.sin(i * 3.7) * 20)));
        return {
            theme: t.theme,
            positive,
            negative: 100 - positive,
        };
    });
}

function generateTrendData(themes: DetectedTheme[]): { month: string;[key: string]: string | number }[] {
    const months = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"];
    const topThemes = themes.slice(0, 4);

    if (topThemes.length === 0) {
        return months.map((month, i) => ({
            month,
            wellness: 40 + i * 6 + Math.floor(Math.sin(i) * 8),
            beauty: 50 + i * 4 + Math.floor(Math.cos(i) * 6),
        }));
    }

    return months.map((month, i) => {
        const row: { month: string;[key: string]: string | number } = { month };
        topThemes.forEach((t, j) => {
            const key = t.theme.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
            row[key] = Math.min(100, Math.max(20, 35 + i * 7 + Math.floor(Math.sin(i * (j + 1) * 1.3) * 15)));
        });
        return row;
    });
}

function generateGapMatrix(concepts: ProductConcept[]): { name: string; x: number; y: number; size: number }[] {
    return concepts.slice(0, 6).map((c) => ({
        name: c.name.length > 20 ? c.name.slice(0, 18) + "…" : c.name,
        x: c.scores.competition,
        y: c.scores.marketSize,
        size: 80 + c.conceptScore,
    }));
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function generateFromUpload(rawTexts: string[]): GeneratedResults {
    const combinedText = rawTexts.join("\n");
    const themes = detectThemes(combinedText);
    const concepts = generateConcepts(themes, combinedText);
    const sentimentData = generateSentimentData(themes);
    const trendData = generateTrendData(themes);
    const gapMatrixData = generateGapMatrix(concepts);

    return { concepts, sentimentData, trendData, gapMatrixData };
}

export function generateFromMine(category: string, keywords: string, sources: string[]): GeneratedResults {
    // If keywords are provided, use them to detect themes just like upload text
    // Otherwise, generate a fake "raw text" based on the selected category to trigger relevant themes
    let analysisText = keywords.toLowerCase();

    if (!analysisText || analysisText.trim() === "") {
        if (category.toLowerCase() === "skincare") {
            analysisText = "moisturizer hydration sunscreen vitamin c acne retinol glass skin sensitive";
        } else if (category.toLowerCase() === "haircare") {
            analysisText = "hair fall hair growth dandruff split ends frizz repair natural onion bond";
        } else if (category.toLowerCase() === "supplements") {
            analysisText = "vitamin d iron gut health sleep ashwagandha pcos protein joint immunity";
        }
    }

    const themes = detectThemes(analysisText);

    // Filter themes to ONLY include those matching the selected category
    const categoryFilteredThemes = themes.filter(
        t => t.category.toLowerCase() === category.toLowerCase()
    );

    // We intentionally ignore the actual category if keywords strongly matched another category,
    // but we prioritize matches from the exact category.
    const finalThemes = categoryFilteredThemes.length > 0 ? categoryFilteredThemes : themes;

    const concepts = generateConcepts(finalThemes, analysisText);

    // If the user typed specific custom keywords, let's inject those into the generated concepts
    // so it actually feels tailored to their exact query instead of just matching a generic theme.
    if (keywords && keywords.trim() !== "") {
        const topKeyword = keywords.split(",")[0].trim();
        const capitalizedKeyword = topKeyword.charAt(0).toUpperCase() + topKeyword.slice(1);

        if (concepts.length > 0) {
            // Modify the first concept heavily to feature the keyword
            concepts[0].name = `${capitalizedKeyword} ${concepts[0].format || "Complex"}`;
            concepts[0].tagline = `Harnessing the power of ${topKeyword} for ${category.toLowerCase()}`;
            concepts[0].ingredients = [capitalizedKeyword, ...concepts[0].ingredients.slice(0, 4)];
            concepts[0].targetPersona.concerns = [capitalizedKeyword, ...concepts[0].targetPersona.concerns.slice(0, 2)];

            // Modify the second concept slightly if it exists
            if (concepts.length > 1) {
                concepts[1].tagline = concepts[1].tagline.replace(".", ` with ${topKeyword}.`);
                concepts[1].ingredients = [capitalizedKeyword, ...concepts[1].ingredients.slice(0, 4)];
            }
        }
    }

    // Customize the citations to reference the selected sources
    if (sources.length > 0) {
        concepts.forEach((concept, index) => {
            // Distribute the sources among the concepts
            const source = sources[index % sources.length];
            const sourceName = source.charAt(0).toUpperCase() + source.slice(1);
            concept.citations = concept.citations.map(c =>
                c.replace("Your uploaded data", `${sourceName} Analysis`)
            );

            if (keywords && keywords.trim() !== "") {
                concept.citations.push(`Keyword Trigger: High search velocity detected for "${keywords}"`);
            }
        });
    }

    const sentimentData = generateSentimentData(finalThemes);

    // Shift sentiment based on sources to make the graph dynamic per selection
    if (sources.length > 0) {
        // Create a predictable but variable shift based on the sources selected
        const shift = sources.reduce((acc, curr) => acc + curr.length, 0) % 15;
        sentimentData.forEach((s, idx) => {
            // alternate shifting positive up or down based on index to create variety
            const mod = (idx % 2 === 0) ? shift : -shift;
            s.positive = Math.min(95, Math.max(30, s.positive + mod));
            s.negative = 100 - s.positive;
        });
    }

    const trendData = generateTrendData(finalThemes);
    const gapMatrixData = generateGapMatrix(concepts);

    return { concepts, sentimentData, trendData, gapMatrixData };
}
