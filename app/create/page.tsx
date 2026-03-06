import React from 'react';
import Link from 'next/link';
import { Sparkles, Microscope, ListChecks } from 'lucide-react';

export const metadata = {
  title: 'Start Your Custom 90-Day Protocol | CurlyHairGuide',
  description: 'Instant, personalized hair porosity and curl type diagnostic.',
};

export default function StartRoutinePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
        
        {/* Updated Header */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
          <div className="bg-pink-500 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xl shadow-md">C</div>
          <h1 className="text-4xl font-serif font-black text-slate-900 leading-tight">Start Your Custom 90-Day Protocol</h1>
        </div>
        
        {/* Core Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <Microscope className="w-8 h-8 text-pink-500 mb-4" />
                <h3 className="font-black text-slate-900 mb-2">Diagnostic</h3>
                <p className="text-sm text-slate-600">Tell us your density, porosity, and current struggles.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <ListChecks className="w-8 h-8 text-pink-500 mb-4" />
                <h3 className="font-black text-slate-900 mb-2">AI Analysis</h3>
                <p className="text-sm text-slate-600">Our diagnostic algorithm builds your specific niche profile.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <Sparkles className="w-8 h-8 text-pink-500 mb-4" />
                <h3 className="font-black text-slate-900 mb-2">Protocol</h3>
                <p className="text-sm text-slate-600">Instantly receive your washing, styling, and sleeping schedule.</p>
            </div>
        </div>
        
        {/* CTA */}
        <div className="text-center pt-8 border-t border-slate-100">
            <Link href="/quiz" className="w-full sm:w-auto inline-block">
              <div className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200 rounded-2xl px-12 py-5 font-black text-2xl flex items-center justify-center transition-all hover:-translate-y-1 active:scale-95">
                Take the Free Quiz &larr;
              </div>
            </Link>
        </div>

        {/* Updated Brand */}
        <div className="mt-16 text-center text-xs text-slate-400 font-medium">
            <div className="flex items-center justify-center gap-2 mb-2 opacity-60">
                <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm">C</div>
                <span className="font-bold text-slate-900 text-sm italic">CurlyHairGuide</span>
            </div>
            Science-Backed Hair Protocols. Stop Guessing. Start Growing.
        </div>

      </div>
    </div>
  );
}