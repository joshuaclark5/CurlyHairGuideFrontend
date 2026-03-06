import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | CurlyHairGuide',
  description: 'Our privacy policy and data handling practices for lead generation.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-white min-h-screen">
      
      {/* Updated Header */}
      <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm">C</div>
          <span className="font-bold text-slate-900 text-sm italic">CurlyHairGuide</span>
      </div>
      
      <h1 className="text-4xl font-serif font-black text-center text-slate-900 mb-6">Privacy Policy</h1>
      <p className="text-slate-500 text-sm text-center mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-pink max-w-none space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b pb-2">1. Introduction</h2>
          <p>Welcome to <strong className="font-medium text-slate-900">CurlyHairGuide</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this policy, please contact us at support@curlyhairguide.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b pb-2">2. Information We Collect (Leads & Diagnostic Data)</h2>
          <p>We collect personal information that you voluntarily provide to us when you complete the diagnostic quiz or submit your email to save your protocol. This is critical data for generating personalized results.</p>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
            <li><strong>Email Address:</strong> This is used to deliver your custom 90-day protocol and tracking calendar.</li>
            <li><strong>Diagnostic Profile (Hair Slug):</strong> This data (e.g., `4c-high-porosity`) is stored with your email to identify your specific niche and provide tailored advice.</li>
            <li><strong>Optional Demographic Data:</strong> We may collect non-identifying data (such as country of origin) to improve our global hair protocols.</li>
          </ul>
        </section>

        {/* UPDATED PURGE: Removal of Credentials/Passwords */}
        <section className="p-4 bg-slate-100 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2">Note on Security: We do not store financial data.</h3>
          <p className="text-sm text-slate-600">This asset is designed for diagnostic lead generation. We do not require account logins or passwords, and we never process payments or collect financial data directly on this Site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b pb-2">3. How We Use Your Information</h2>
          <p>We use your information to facilitate account creation (identifying your profile), manage user leads (Supabase), improve the diagnostic algorithm, and, with your permission, send you relevant affiliate product updates and hair-care educational content.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b pb-2">4. Data Storage & Security (Supabase)</h2>
          <p>Your email and diagnostic profile are stored securely in a dedicated Supabase database. We use appropriate technical security measures to protect the integrity of this data. However, as no internet transmission is 100% secure, we cannot guarantee absolute security against unauthorized access.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b pb-2">5. Contact Us</h2>
          <p>If you have questions about this policy, or if you wish to request that your diagnostic profile and email be removed from our database, please contact us at support@curlyhairguide.com.</p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-100 text-center">
        <Link href="/" className="text-slate-400 font-bold text-sm hover:underline hover:text-slate-900">
            &larr; Return to Diagnostic Quiz
        </Link>
      </div>

    </div>
  );
}