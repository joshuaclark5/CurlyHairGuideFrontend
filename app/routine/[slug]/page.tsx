import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import hairData from './../../components/data/hair-data.json';
import EmailCapture from './../../components/EmailCapture';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Microscope, Droplets, Scale, ThumbsUp } from 'lucide-react';

// SECURE FETCH: This forces Vercel to only fetch data on every request (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // 🛑 ABSOLUTE CACHE KILLER: Forces Vercel to generate this fresh every time.

// We defined a custom type to handle the JSON mapping correctly
type HairDataEntry = {
  title: string;
  niche_slug: string;
  analysis: {
    scalp_health: string;
    porosity: string;
    texture: string;
    density: string;
    strand_width: string;
    sensitive_scalp: string;
    curl_type: string;
  };
};

// Generates static paths for all 50+ combinations in your JSON
export async function generateStaticParams() {
  return Object.keys(hairData).map((slug) => ({
    slug: slug,
  }));
}

// SEO: This dynamically creates the title and description for each specific hair type
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dataFallback = (hairData as any)[params.slug] as HairDataEntry | undefined;
  if (!dataFallback) return { title: 'Routine Not Found' };

  // Convert slug to readable title: 4c-high-porosity -> 4C High Porosity Hair Routine
  const readableTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${readableTitle} Routine | 90-Day Custom Challenge | CurlyHairGuide`,
    description: `Your custom science-backed 90-day diagnostic protocol for ${readableTitle} hair. Washing, styling, and sleeping schedule. Stop guessing. Start growing.`,
  };
}

export default async function RoutinePage({ params }: { params: { slug: string } }) {
  const dataFallback = (hairData as any)[params.slug] as HairDataEntry | undefined;
  if (!dataFallback) return notFound();

  // 1. Unified fallback content in case AI generation has not yet filled the slot
  const fallbackAnalyzerData = {
    niche_analysis: 'Analyzing your custom hair fingerprint... Stop Guessing. Start Growing. Our Analyzer is building your specific tricho-diagnostic profile based on your generated slug. Comprehensive 700+ word analysis arriving soon.',
    cleansing_protocol: `Calculating your optimal shampoo/conditioner balance... (Cleanser prescription arriving soon - Vetted Affiliate recommended product)`,
    styling_protocol: `Optimizing your curl definition and moisture lock... (Styling product prescription arriving soon - Vetted Affiliate recommended product)`,
    sleeping_protocol: `Protecting your curls overnight to eliminate friction... (Silk/Satin recommendation arriving soon - Vetted Affiliate recommended product)`,
    key_ingredients: ['Cleansing Agent', 'Moisture Sealer', 'Growth Oil']
  };

  // 2. Hook up to the NEW 'Service Role Key' to see all generated content (Bypasses RLS)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing! Live Analyzer failed.');
  }

  // Initialize Supabase with the Service Role Key (The Brain)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey || '', 
    { auth: { persistSession: false } }
  );

  // 3. FETCH THE 30-PAGE AI-ANALYZER REPORT (The New Dynamic Content)
  // ⚠️ Note: For local development, this will fetch nothing because we haven't built the table.
  const { data: analyzerContent, error: analyzerError } = await supabase
    .from('niche_seo_pages') // ⚠️ PLACEHOLDER TABLE: We will create this in Supabase later.
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (analyzerError) {
    // Expected on local: 404 or table not found
    console.warn(`Local Note: Fetch failed for ${params.slug} (Normal if table is not created). Using fallback.`);
  }

  // Use the fetched data OR the fallback
  const analyzerData = analyzerContent || fallbackAnalyzerData;

  // Icons mapping for the summary section
  const iconMap = {
    curl_type: <Scale className="w-5 h-5 text-pink-500 mb-2" />,
    porosity: <Droplets className="w-5 h-5 text-pink-500 mb-2" />,
    density: <Scale className="w-5 h-5 text-pink-500 mb-2" />
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        
        {/* Header (Branded Pink Accent) */}
        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-slate-100">
          <div className="bg-pink-500 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xl shadow-md">C</div>
          <h1 className="text-4xl font-serif font-black text-slate-900 leading-tight">Your 90-Day Custom Hair Protocol</h1>
        </div>

        {/* Niche Summary (Correctly mapping JSON 'analysis' table) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="p-5 bg-slate-100 rounded-xl">
                {iconMap.curl_type}
                <h3 className="font-bold text-slate-900 text-sm">Curl Type</h3>
                {/* Fixed the typo from the image: analysis.curl_type instead of curl_type directly */}
                <p className="text-slate-700 font-medium">{dataFallback.analysis.curl_type}</p>
            </div>
            <div className="p-5 bg-slate-100 rounded-xl">
                {iconMap.porosity}
                <h3 className="font-bold text-slate-900 text-sm">Porosity</h3>
                <p className="text-slate-700 font-medium">{dataFallback.analysis.porosity}</p>
            </div>
            <div className="p-5 bg-slate-100 rounded-xl">
                {iconMap.density}
                <h3 className="font-bold text-slate-900 text-sm">Density</h3>
                <p className="text-slate-700 font-medium">{dataFallback.analysis.density}</p>
            </div>
            <div className="p-5 bg-slate-100 rounded-xl md:col-span-1 border border-amber-100 bg-amber-50">
                <ThumbsUp className="w-5 h-5 text-amber-500 mb-2" />
                <h3 className="font-bold text-amber-900 text-sm">Goal State</h3>
                <p className="text-amber-800 font-medium">90-Day Challenge</p>
            </div>
        </div>

        {/* AI Analyzer Report (Comprehensive Analysis) */}
        <div className="mb-16 pt-12 border-t border-slate-100">
            <h2 className="text-2xl font-serif font-black text-slate-900 mb-4 flex items-center gap-3">
              <Microscope className="w-6 h-6 text-pink-500" /> Niche-Data Trichology Analysis
            </h2>
            <div className="prose prose-slate text-slate-700 leading-relaxed text-sm max-w-none">
                <p>{analyzerData.niche_analysis}</p>
            </div>
        </div>

        {/* Affiliate Monetization Engine ( real linked products ) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pt-12 border-t border-slate-100">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-900 mb-2 tracking-tight">1. Cleansing Protocol</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{analyzerData.cleansing_protocol}</p>
                </div>
                <div className="p-4 bg-slate-100 rounded-xl text-[10px] text-slate-600 border border-slate-200 mt-6 leading-relaxed">
                    <strong>Affiliate Notice:</strong> CurlyHairGuide participates in various affiliate programs. We may receive commissions on purchases made through links on this Site at no additional cost to you.
                </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-900 mb-2 tracking-tight">2. Styling Protocol</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{analyzerData.styling_protocol}</p>
                </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-900 mb-2 tracking-tight">3. Sleeping Protocol</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{analyzerData.sleeping_protocol}</p>
                </div>
            </div>
        </div>

        {/* Key Ingredients (Styled with Pink Accent) */}
        <div className="bg-slate-100 p-8 rounded-2xl mb-16 border border-slate-200">
            <ThumbsUp className="w-6 h-6 text-pink-500 mb-3" />
            <h3 className="font-bold text-slate-900 text-lg mb-3">Key Vetted Ingredients for Your Profile:</h3>
            <div className="flex flex-wrap gap-2">
                {analyzerData.key_ingredients.map(ingredient => (
                    <span key={ingredient} className="bg-white px-3 py-1 rounded-full text-xs text-slate-700 font-medium border border-slate-200 shadow-sm">{ingredient}</span>
                ))}
            </div>
        </div>

        {/* Lead Capture (Database separation confirmed) */}
        <EmailCapture slug={params.slug} />

        {/* Bottom CTA (Internal Upsell to the detailed 30-page report) */}
        <div className="text-center pt-16 border-t border-slate-100 mt-16">
            <h2 className="text-3xl font-serif font-black text-slate-900 mb-3 leading-snug">Find Your Exact Custom Variations</h2>
            <p className="text-slate-600 mb-10 text-sm max-w-xl mx-auto leading-relaxed">This protocol is generalized for your niche. For a 30-page medical-grade analysis including elasticity, fine/coarse texture, chemical treatment history, sensitive scalp, and density variations, take the detailed diagnostic.</p>
            <Link href="/quiz">
              <div className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200 rounded-2xl px-12 py-5 font-black text-xl flex items-center justify-center transition-all hover:-translate-y-1 active:scale-95">
                Take the Detailed Tricho-Diagnostic &rarr;
              </div>
            </Link>
        </div>

      </div>
    </div>
  );
}