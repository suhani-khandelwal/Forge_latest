export interface SubCompetitor {
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

export interface CompetitiveIntelligence {
  competitors: SubCompetitor[];
  key_differentiation: string;
  white_space: string;
  pricing_benchmark: {
    low: string;
    mid: string;
    premium: string;
  };
}

export const getCompetitiveIntelligence = (category: string, tags: string[], name: string): CompetitiveIntelligence => {
  const searchTerm = (name + " " + tags.join(" ") + " " + category).toLowerCase();

  // Keyword extraction for detailed mock AI generation
  if (searchTerm.includes('sun') || searchTerm.includes('spf') || searchTerm.includes('uv')) {
    return {
      key_differentiation: "Most competitors heavily rely on basic chemical filters leaving white casts. Only a few newer brands emphasize ultra-light gel textures specifically built with Hyaluronic Acid for Indian humidity.",
      white_space: "A completely matte, sweat-resistant tinted sunscreen designed for Indian skin tones that also functions as an acne-treatment base without pilling.",
      pricing_benchmark: { low: "₹250 - ₹350", mid: "₹400 - ₹550", premium: "₹700+" },
      competitors: [
        { brand: "The Derma Co", product_name: "1% Hyaluronic Sunscreen Aqua Gel", price: "₹499", spf_or_strength: "SPF 50 PA++++", key_ingredients: ["Hyaluronic Acid", "Vitamin E"], skin_type_or_target: "All Skin Types", claims: ["No White Cast", "Broad Spectrum", "Fragrance-Free"], rating: "4.4/5", platform: "Official Website", product_url: "https://thedermaco.com/product/1-hyaluronic-sunscreen-aqua-gel" },
        { brand: "Aqualogica", product_name: "Glow+ Dewy Sunscreen", price: "₹449", spf_or_strength: "SPF 50 PA++++", key_ingredients: ["Vitamin C", "Papaya Extracts", "Hyaluronic Acid"], skin_type_or_target: "Dry/Combination", claims: ["Dewy Finish", "Water Light", "Blue Light Protection"], rating: "4.5/5", platform: "Official Website", product_url: "https://aqualogica.in/product/glow-dewy-sunscreen-with-papaya-vitamin-c-50-g" },
        { brand: "Minimalist", product_name: "Light Fluid SPF 50", price: "₹499", spf_or_strength: "SPF 50", key_ingredients: ["Tinosorb M", "Uvinul A+", "OMC"], skin_type_or_target: "Oily/Acne Prone", claims: ["Non-comedogenic", "Photostable"], rating: "4.3/5", platform: "Official Website", product_url: "https://beminimalist.co/products/light-fluid-spf-50" },
        { brand: "Dot & Key", product_name: "Vitamin C + E Super Bright Sunscreen", price: "₹495", spf_or_strength: "SPF 50 PA+++", key_ingredients: ["Vitamin C", "Vitamin E", "Blood Orange"], skin_type_or_target: "Dull Skin", claims: ["Glow Enhancing", "Water Resistant"], rating: "4.2/5", platform: "Nykaa", product_url: "https://www.nykaa.com/dot-key-vitamin-c-e-super-bright-sunscreen-spf-50-pa/p/7421516" },
        { brand: "WOW Skin Science", product_name: "Matte Finish Sunscreen", price: "₹375", spf_or_strength: "SPF 55 PA+++", key_ingredients: ["Raspberry Extract", "Carrot Seed"], skin_type_or_target: "Oily Skin", claims: ["Matte Finish", "Paraben Free"], rating: "4.0/5", platform: "Amazon India", product_url: "https://www.amazon.in/WOW-Skin-Science-Sunscreen-Protection/dp/B085VSR9C9" }
      ]
    };
  }

  if (searchTerm.includes('hair fall') || searchTerm.includes('growth') || searchTerm.includes('thinning')) {
    return {
      key_differentiation: "Mass market brands lean heavily on botanical extracts (Onion, Amla) pushing natural claims. Clinical native D2C brands dominate higher consumer satisfaction by utilizing lab-proven active complexes like Redensyl and Capixyl.",
      white_space: "A hybrid scalp serum that combines proven clinical peptides (like Procapil) with soothing Ayurvedic adaptogens to target stress-induced hair shedding common in urban Indian millennials.",
      pricing_benchmark: { low: "₹200 - ₹350", mid: "₹400 - ₹600", premium: "₹750+" },
      competitors: [
        { brand: "Minimalist", product_name: "Hair Growth Actives 18%", price: "₹799", spf_or_strength: "18% Actives", key_ingredients: ["Capixyl", "Redensyl", "Procapil", "Baicapil"], skin_type_or_target: "Thinning Hair", claims: ["Clinically Proven", "Visible Growth in 8 Weeks"], rating: "4.2/5", platform: "Official", product_url: "https://beminimalist.co/products/hair-growth-actives-18" },
        { brand: "Mamaearth", product_name: "Onion Hair Oil", price: "₹399", spf_or_strength: "Standard", key_ingredients: ["Onion Seed Extract", "Redensyl", "Almond Oil"], skin_type_or_target: "Hair Fall", claims: ["Controls Hair Fall", "Adds Shine", "Toxin Free"], rating: "4.4/5", platform: "Mamaearth", product_url: "https://mamaearth.in/product/onion-hair-oil-for-hair-fall-control" },
        { brand: "L'Oreal Paris", product_name: "Fall Resist 3X Anti-Hair Fall", price: "₹220", spf_or_strength: "Standard", key_ingredients: ["Arginine Essence", "Salicylic Acid"], skin_type_or_target: "Weak Roots", claims: ["Reduces Hair Fall by 90%", "Nourishes Root"], rating: "4.3/5", platform: "Nykaa", product_url: "https://www.nykaa.com/" },
        { brand: "TRESemme", product_name: "Hair Fall Defense", price: "₹250", spf_or_strength: "Standard", key_ingredients: ["Keratin", "Glycerin"], skin_type_or_target: "Damaged Hair", claims: ["Reinforces Hair Strength", "Smoothens"], rating: "4.1/5", platform: "Amazon India", product_url: "https://www.amazon.in/TRESemme-Hair-Fall-Defense-Shampoo/dp/B07GSV2T87" },
        { brand: "Pilgrim", product_name: "Redensyl & Anagain Hair Serum", price: "₹850", spf_or_strength: "3% Redensyl", key_ingredients: ["Redensyl", "Anagain", "Green Tea"], skin_type_or_target: "Receding Hairline", claims: ["FDA Approved", "Vegan"], rating: "4.3/5", platform: "Nykaa", product_url: "https://www.nykaa.com/pilgrim-redensyl-3-anagain-4-advanced-hair-growth-serum/p/5013093" }
      ]
    };
  }

  // Fallback Generation
  return {
    key_differentiation: "Most competitors offer single-active formulations aimed at budget-conscious consumers. Formulation elegance and multi-active synergies remain scarce except in premium imported ranges.",
    white_space: "A highly stabilized, encapsulated active blend that brings international premium formulation elegance to a mid-market price point designed for the Indian climate.",
    pricing_benchmark: { low: "₹299 - ₹450", mid: "₹499 - ₹799", premium: "₹999+" },
    competitors: [
      { brand: "Minimalist", product_name: "Hydrating Face Moisturizer", price: "₹349", spf_or_strength: "10% V-B5", key_ingredients: ["Vitamin B5", "Hyaluronic Acid", "Zinc"], skin_type_or_target: "All Skin Types", claims: ["Oil Free", "Repairs Barrier"], rating: "4.4/5", platform: "Official", product_url: "https://beminimalist.co/products/vitamin-b5-10-moisturizer" },
      { brand: "Plum", product_name: "10% Niacinamide Face Serum", price: "₹599", spf_or_strength: "10% Strength", key_ingredients: ["Niacinamide", "Rice Water", "Squalane"], skin_type_or_target: "Blemishes", claims: ["Fades Marks", "Clears Pores"], rating: "4.3/5", platform: "Nykaa", product_url: "https://plumgoodness.com/products/10-niacinamide-face-serum-with-rice-water" },
      { brand: "Dot & Key", product_name: "Ceramides & Hyaluronic Repair", price: "₹395", spf_or_strength: "Standard", key_ingredients: ["5 Ceramides", "Hyaluronic Acid"], skin_type_or_target: "Dry/Damaged", claims: ["Intense Repair", "Non-greasy"], rating: "4.5/5", platform: "Amazon", product_url: "https://www.dotandkey.com/products/ceramides-hyaluronic-face-cream" },
      { brand: "Re'equil", product_name: "Ceramide & Hyaluronic Acid Moisturiser", price: "₹395", spf_or_strength: "Standard", key_ingredients: ["Ceramide III", "Mango Butter"], skin_type_or_target: "Normal/Dry", claims: ["Dermat Tested", "Non-comedogenic"], rating: "4.4/5", platform: "Nykaa", product_url: "https://www.reequil.com/products/ceramide-hyaluronic-acid-moisturiser" },
      { brand: "The Ordinary", product_name: "Niacinamide 10% + Zinc 1%", price: "₹550", spf_or_strength: "11% Actives", key_ingredients: ["Niacinamide", "PCA Zinc"], skin_type_or_target: "Oily", claims: ["Regulates Sebum", "Cruelty Free"], rating: "4.6/5", platform: "Nykaa", product_url: "https://www.nykaa.com/the-ordinary-niacinamide-10-zinc-1/p/5003166" }
    ]
  };
};
