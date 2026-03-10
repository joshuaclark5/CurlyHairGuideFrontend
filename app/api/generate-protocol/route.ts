import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { answers, slug, currentDate } = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
    const { data: vettedProducts } = await supabase.from('vetted_products').select('*');

    const productMapping = (vettedProducts || []).map((p) => ({
      name: p.product_name,
      brand: p.brand,
      link: `${p.affiliate_link}&tag=${process.env.AMAZON_ASSOCIATES_ID || 'curlyhairguid-20'}`, 
    }));

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      Act as a Clinical Trichologist. Today is ${currentDate}.
      User Data: ${JSON.stringify(answers)}
      Location: Layton, UT (352 PPM Hard Water)

      STRICT OUTPUT FORMAT (3 SECTIONS SEPARATED BY '---'):

      SECTION I: Biological Assessment
      2 paragraphs on how Layton's 352 PPM water interacts with ${answers.porosity} porosity. Use clinical terms like "mineral crystallization" and "cuticle fatigue."

      ---

      SECTION II: 90-Day Master Schedule
      Create a 12-week routine. Group into 3 phases: 
      Phase 1 (Weeks 1-4): Mineral Detox
      Phase 2 (Weeks 5-8): Structural Repair
      Phase 3 (Weeks 9-12): Maintenance
      For each phase, provide a clear weekly rhythm (e.g., Wash Day, Mid-week Hydration, Daily Serum).
      FORMAT: Use HTML <h4> for Week numbers and bullet points for actions.

      ---

      SECTION III: Clinical Tool Kit
      Recommend 4 specific items from this list: ${JSON.stringify(productMapping)}.
      FORMAT: You MUST list them exactly as: PRODUCT_NAME | BRAND | LINK
      One product per line.
    `;

    const result = await model.generateContent(systemPrompt);
    const protocol = result.response.text();

    await supabase.from('hair_leads').insert({
      slug: slug || 'analyzed-report',
      answers,
      generated_protocol: protocol,
      customer_email: answers.email || 'Lead Capture Placeholder',
    });

    return NextResponse.json({ protocol });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}