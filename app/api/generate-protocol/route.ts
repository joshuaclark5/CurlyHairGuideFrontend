import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 🛑 LAMANS TERMS: This is the unified "Brain" of the CurlyHairGuide asset.
// It connects the user's biology (Quiz), the expert's knowledge (Gemini System Prompt),
// and the monetization (Vetted Supabase Products with your Amazon ID).

export async function POST(req: NextRequest) {
  try {
    const { answers, slug } = await req.json();

    // 1. Hook up to Supabase to find the "Expert Vetted" Products
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use 'Brain' key to bypass RLS
      { auth: { persistSession: false } }
    );

    // Query the database for products that match the user's specific niches
    const { data: vettedProducts, error: productsError } = await supabase
      .from('vetted_products')
      .select('*')
      // LAMANS TERMS: Find products tagged with 'oily-scalp' OR 'fine-texture', etc.
      .or(answers.hair_niches.map((niche: string) => `for_hair_niche.ilike.%${niche}%`).join(','));

    if (productsError) {
      console.error('Error fetching vetted products:', productsError);
    }

    // 2. Map and Unify Product Monetization (Activated your live Amazon ID)
    const productMapping = (vettedProducts || []).map((p) => {
      return {
        name: p.product_name,
        brand: p.brand,
        description: p.product_description, // This description is the expert scientific analysis (V)
        type: p.product_type,
        // The Affiliate Engine: Generating the final monetized Amazon URL
        link: `${p.affiliate_link}&tag=${process.env.AMAZON_ASSOCIATES_ID}`, 
      };
    });

    // 3. Construct the 30-Page Medical-Grade 'System Prompt' (Vercel Gemini Research II)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemPrompt = `
      Act as a World-Class Clinical Trichologist and Stylist. You are an expert in fiber physics, scalp microbiology, and cosmetic chemistry. You are tasked with analyzing the user data provided and generating a comprehensive, 30-page (7,500-10,000 words) personalized 'Prescription Protocol.'

      Core Objective: Generate a molecularly precise, lifestyle-integrated hair restoration and maintenance plan that bridges the gap between clinical science and salon-level styling.

      User generated profile (the dynamic slug): ${slug}
      User 15 Detailed Quiz Answers (Biology & Physics Data): ${JSON.stringify(answers)}

      ---
      Section I: The Science of Your Strands (Analytical Narrative)
      - [Instruction]: Using the porosity, elasticity, texture, and density data, provide a molecular analysis of the user's hair fiber. Explain the state of their cuticle (compact/hydrophobic or raised/hydrophilic) and the health of their disulfide bonds.
      - [Environmental Modeling]: specifically analyze the impact of their location (specifically targeting hard water zones like Layton, Utah (352 PPM)). Explain *exactly* how the Ca2+ and Mg2+ ions are blocking their current products based on their biology. (Gemini Research V)

      ---
      Section II: The Molecular Tool Kit (Monetized Product Engine)
      - [Instruction]: You must use the provided database of expert-vetted products for monetization. Replace all "Product Type" placeholders with the specific, linked recommendations. (DO NOT suggest generic products). Provide instructions for how to vary the protocol based *exactly* on the variations of the 15 quiz answers (If/Then Gates (IV)).

      Here is the database of Vetted Product Data:
      ${JSON.stringify(productMapping)}

      ---
      Section III: The 30-Day Prescriptive Schedule (The Core Product)
      - [Instruction]: Create a granular, 30-day calendar. For each day, specify the WASHING routine (chelating/co-wash), the TREATMENT routine (bond-builders/protein), the STYLING routine (methods: Shingling for Type 4 vs. Squish to Condish for Type 2), and the NIGHTTIME routine (Twists/Bonnet (Silk (VI))).

      Conclusion: Conclude the 30-page protocol with a clear CTA: 'Your molecular profile suggests a high sensitivity to environmental mineral accumulation. To ensure your 30-day progress remains on track, book your 1-on-1 Virtual Clinical Scalp Scan for a high-resolution progress review with our senior trichological staff.'

      Technical Requirements: Use LaTeX for scientific notation ($H_2O$, $Ca^{2+}$, etc.). Ton: clinical, authoritative, and professional. Stick to continuous, narrative prose.
    `;

    // 4. GENERATION (The grand construction)
    const result = await model.generateContent(systemPrompt);
    const protocol = result.response.text();

    // Store the generated lead and report in Supabase for Lead-Value verification (Phase 5)
    await supabase.from('hair_leads').insert({
      slug,
      answers,
      generated_protocol: protocol,
      customer_email: answers.customer_email || 'Lead Capture Placeholder',
    });

    // Output the massive monetized 30-page report as JSON
    return NextResponse.json({ protocol });

  } catch (error) {
    console.error('API Error in Analyzer engine:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}