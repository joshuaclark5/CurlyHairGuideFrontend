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

    const productMapping = (vettedProducts || []).map((p) => ({
      name: p.product_name,
      brand: p.brand,
      link: `${p.affiliate_link}&tag=${process.env.AMAZON_ASSOCIATES_ID || 'curlyhairguid-20'}`, 
    }));

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🧠 VALUE-FIRST SYSTEM PROMPT
    const systemPrompt = `
      Act as a clinical hair researcher. Today is ${currentDate}.
      User Data: ${JSON.stringify(answers)}
      Location: Layton, UT (352 PPM Hard Water)

      STRICT FORMATTING:
      - NO asterisks (**) or hashes (#). 
      - Use plain text paragraphs.
      - Section I MUST start with 2 extremely specific, actionable sentences about how their porosity and the 352 PPM Layton water are currently damaging their hair.
      
      STRUCTURE:
      SECTION I: Biological Assessment. (Prove value immediately).
      ---
      SECTION II: The 90-Day Schedule. (Granular calendar).
      ---
      SECTION III: Clinical Tool Kit. (Recommend these: ${JSON.stringify(productMapping)})

      Separate sections ONLY with '---'.
    `;

    const result = await model.generateContent(systemPrompt);
    const protocol = result.response.text();

    // Data persistence for your records
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