import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import FeedbackWidget from './components/FeedbackWidget';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google'; // 👈 Activated with new ID

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // Update this URL once you connect the real domain (curlyhairguide.com)
  metadataBase: new URL('http://localhost:3000'), 
  title: {
    default: 'CurlyHairGuide | Science-Backed AI Diagnostic',
    template: '%s | CurlyHairGuide',
  },
  description: 'Instant, personalized hair protocols. Stop guessing. Start growing. Find your custom 90-day washing, styling, and sleeping schedule.',
  keywords: [
    'curly hair routine', 
    'hair porosity quiz', 
    'curly girl method diagnostic', 
    '90-day hair protocol', 
    'type 4c hair care'
  ],
  openGraph: {
    title: 'CurlyHairGuide | Stop Guessing. Start Growing.',
    description: 'Custom science-backed hair protocols. Instant results.',
    url: 'http://localhost:3000',
    siteName: 'CurlyHairGuide',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CurlyHairGuide | Personalized Protocols',
    description: 'Instant hair porosity diagnostic and custom routine building.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        
        {/* MAIN CONTENT */}
        <main className="flex-grow">
            {children}
        </main>
        
        {/* 🛡️ GLOBAL LEGAL FOOTER (Hidden on Print) */}
        <footer className="bg-slate-50 border-t border-slate-100 py-12 px-4 print:hidden">
            <div className="max-w-7xl mx-auto text-center">
                
                {/* Updated Brand: Pink 'C' */}
                <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
                    <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm">C</div>
                    <span className="font-bold text-slate-900 text-sm italic">CurlyHairGuide</span>
                </div>

                {/* Updated "Educational" Disclaimer */}
                <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
                    <strong>DISCLAIMER:</strong> The diagnostic tools, results, and protocols provided by CurlyHairGuide are for informational and educational purposes only. We are not medical professionals and do not provide medical advice. Consult with a trichologist or dermatologist for clinical concerns. Use of this site is at your own risk. This site contains affiliate links; we may receive a commission at no additional cost to you.
                </p>

                {/* Legal Links (Pink Accent) */}
                <div className="flex justify-center gap-6 text-xs text-slate-500 font-medium">
                    <Link href="/terms-of-service" className="hover:text-pink-600 transition-colors">Terms of Service</Link>
                    <Link href="/privacy-policy" className="hover:text-pink-600 transition-colors">Privacy Policy</Link>
                    <Link href="/disclaimer" className="hover:text-pink-600 transition-colors">Full Disclaimer</Link>
                </div>

                <p className="text-[10px] text-slate-300 mt-8">
                    © {new Date().getFullYear()} CurlyHairGuide. All rights reserved.
                </p>
            </div>
        </footer>

        {/* Keeping the widget as requested */}
        <FeedbackWidget />
        
        {/* 📊 ANALYTICS COMPONENT - Activated with your new Measurement ID from Image 14 */}
        <GoogleAnalytics gaId="G-LV7QTZR1NG" /> 
      </body>
    </html>
  );
}