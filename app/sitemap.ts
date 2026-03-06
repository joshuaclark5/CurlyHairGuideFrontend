import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Force dynamic so Vercel rebuilds this on every request (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // 🛑 ABSOLUTE CACHE KILLER: Forces Vercel to generate this fresh every time.

// CUSTOM FETCH: Forces Next.js to never cache the database response
const fetchNoCache = (url: string, options?: RequestInit) => {
  return fetch(url, { ...options, cache: 'no-store', next: { revalidate: 0 } });
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const timestamp = new Date().toISOString();
  console.log(`GENERATING CURLYHAIRGUIDE SITEMAP at ${timestamp}`);

  // 1. Hook up to the NEW 'Service Role Key' from your `.env.local`
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing!');
  }

  // Initialize Supabase with the NEW Service Key (Bypasses RLS to see all profiles)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey || '', 
    {
      auth: { persistSession: false },
      global: {
        fetch: fetchNoCache, 
      },
    }
  );

  // 2. Updated Brand URL (The final 'CurlyHairGuide.com' destination)
  const baseUrl = 'https://curlyhairguide.com';

  // 3. FETCH THE 50 Niche SEO PAGES (The New 'hair_profiles' Content)
  // We only care about the slug (e.g., '4c-high-porosity')
  const { data: nicheProfiles, error: nicheError } = await supabase
    .from('hair_profiles')
    .select('slug');

  if (nicheError) {
    console.error('Error fetching niche hair profiles:', nicheError.message);
  } else {
    console.log(`Hair Profiles Found: ${nicheProfiles?.length || 0}`);
  }

  // 4. MAPPING

  // Hair Profile URLs (Niche Traffic Pages)
  const nicheUrls = (nicheProfiles || []).map((page) => {
    // 🛡️ MAPPING TO THE 'routine/' FOLDER: www.curlyhairguide.com/routine/slug
    return {
      url: `${baseUrl}/routine/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  // 5. STATIC ROUTES (Clean Slate)
  const staticRoutes: MetadataRoute.Sitemap = [
    // Home Page (Main Quiz)
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    // Legal/Disclaimer (Professional Touch)
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Combine ALL (Zero Deduplication Needed on this clean slate)
  const finalSitemap = [...staticRoutes, ...nicheUrls];
  
  console.log(`SITEMAP GENERATION COMPLETE: ${finalSitemap.length} URLs`);
  
  return finalSitemap;
}