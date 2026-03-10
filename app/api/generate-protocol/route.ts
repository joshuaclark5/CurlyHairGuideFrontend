import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { answers, slug, currentDate } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, 
      { auth: { persistSession: false } }
    );

    const { data: vettedProducts } = await supabase.from('vetted_products').select('*');

    const productMapping = (vettedProducts || []).map((p) => {
      // 🛡️ LINK FIX: Don't use 'product_asin'. Use the real link or a clean search fallback.
      const baseLink = p.affiliate_link && !p.affiliate_link.includes('product_asin') 
        ? p.affiliate_link 
        : `https://www.amazon.com/s?k=${encodeURIComponent(p.product_name + ' ' + p.brand)}`;

      return {
        name: p.product_name,
        brand: p.brand,
        // Use your specific tag and ensure it's the only one
        link: `${baseLink}${baseLink.includes('?') ? '&' : '?'}tag=${process.env.AMAZON_ASSOCIATES_ID || 'curlyhairguid-20'}`, 
      };
    });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      Act as a clinical trichologist. Today is ${currentDate}.
      User Profile: ${JSON.stringify(answers)}
      Location: Layton, UT (352 PPM Hard Water)

      STRICT OUTPUT RULES:
      1. NO asterisks (**) and NO hashes (#).
      2. Use 3 SECTIONS separated ONLY by '---'.

      SECTION I: Biological Assessment.
      Write 2 clinical paragraphs. Start with "Hello ${answers.firstName || 'there'},". 
      Explain how Layton's 352 PPM water is crystallizing on ${answers.porosity} porosity hair.

      ---

      SECTION II: 90-Day Roadmap.
      Provide 12 INDIVIDUAL weekly entries. 
      FORMAT: Start each week with <h4>Week X</h4>. 
      Under each heading, use bullet points for daily actions. 
      Keep text concise and scannable.

      ---

      SECTION III: Tool Kit.
      Recommend 4 items from: ${JSON.stringify(productMapping)}.
      FORMAT: PRODUCT_NAME | BRAND | LINK (One per line).
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