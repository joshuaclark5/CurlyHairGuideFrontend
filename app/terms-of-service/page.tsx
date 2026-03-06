import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | CurlyHairGuide',
  description: 'Terms and conditions for using the CurlyHairGuide diagnostic platform.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-white min-h-screen">
      
      {/* Updated Header */}
      <div className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-black text-slate-900 mb-2 leading-tight">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2 text-pink-500 opacity-60">
            <div className="bg-pink-500 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shadow-sm">C</div>
            <span className="font-bold text-slate-900 tracking-tight italic text-sm">CurlyHairGuide</span>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
        
        {/* 1. AGREEMENT */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing, browsing, or using <strong className="text-slate-900 italic font-medium">CurlyHairGuide</strong> (the "Platform"), you agree to be bound by these Terms of Service. 
            If you do not agree with any part of these terms, you are prohibited from using this Platform.
          </p>
        </section>

        {/* 2. NATURE OF PLATFORM (Updated) */}
        <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Nature of Platform & Affiliate Relations</h2>
          <p className="mb-4 font-medium text-slate-800">
            CurlyHairGuide acts solely as an educational diagnostic technology provider.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-sm text-slate-700">
            <li><strong>Affiliate Affiliate Disclosures:</strong> In order to provide this diagnostic tool at no cost, we participate in affiliate marketing programs. We may receive commissions when you purchase products through links recommended on the Site. This occurs at <strong className="font-black">no additional cost to you.</strong></li>
            <li><strong>We Do Not Sell Products directly:</strong> We are not a direct seller or distributor of the hair-care products recommended in our protocols. Any purchase you make is strictly between you and the third-party merchant (e.g., Amazon, Ulta, or direct brand websites).</li>
            <li><strong>Product Issues:</strong> Disputes regarding product quality, shipping, or refunds must be directed to the third-party merchant, not CurlyHairGuide.</li>
          </ul>
        </section>

        {/* 3. DIAGNOSTIC ACCURACY */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Diagnostic Accuracy & Leads</h2>
          <p>
            While our AI-driven diagnostic tool analyzes specific traits, the resulting protocols are based on general niche data. CurlyHairGuide does not guarantee specific results regarding hair health, growth, or curl definition improvement. By using the Platform and entering your email, you acknowledge that we may use your diagnostic data (slug-format) to deliver personalized results.
          </p>
        </section>

        {/* 4. FREELANCER/STRIPE PURGE: SECTION REMOVED */}
        {/* (The fees and transaction sections from MicroFreelanceHub are now deleted) */}

        {/* 5. LIMITATION OF LIABILITY (Pink Accent) */}
        <section className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h2 className="text-xl font-bold text-red-900 mb-3 uppercase tracking-wide">4. Limitation of Liability</h2>
          <p className="text-red-800 text-sm leading-relaxed font-medium">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CURLYHAIRGUIDE, ITS OWNERS, AND EMPLOYEES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR USE OF OR INABILITY TO USE THE DIAGNOSTIC PLATFORM; (B) ANY HAIR OR SCALP REACTION TO RECOMMENDED PROTOCOLS OR AFFILIATE PRODUCTS; (C) INACCURACY OF DIAGNOSTIC RESULTS; OR (D) UNAUTHORIZED ACCESS OR USE OF YOUR LEADS DATA.
          </p>
        </section>

        {/* 6. INDEMNIFICATION */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless CurlyHairGuide, its owners, and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your violation of these Terms or your use of the protocols generated by the Platform.
          </p>
        </section>

        {/* 7. MODIFICATIONS */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">6. Modifications</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. Significant changes will be posted on this page. By continuing to use the Platform, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="pt-8 border-t border-slate-100">
          <Link href="/privacy-policy" className="text-pink-600 font-bold text-sm hover:underline hover:text-pink-700">
            View Our Privacy Policy &rarr;
          </Link>
        </section>

      </div>
    </div>
  );
}