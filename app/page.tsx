'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Microscope,
  Zap,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-100">
      
      {/* 1. NAVBAR */}
      <nav className="border-b border-gray-100/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-pink-500 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-lg shadow-md">C</div>
            <span className="font-bold text-xl tracking-tight text-slate-900 italic">CurlyHairGuide</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link 
              href="/quiz" 
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md hover:scale-105"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="px-6 pt-20 pb-12 md:pt-32 md:pb-16 max-w-6xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>

        <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Science-Backed Diagnostic
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Stop Guessing. <br className="hidden md:block" />
            <span className="text-pink-500 underline decoration-pink-200 underline-offset-8">Start Growing.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every curl pattern is a unique genetic code. Our AI-driven diagnostic identifies your porosity and type to build a <strong className="text-slate-900 font-bold text-lg">90-Day Hair Protocol</strong> specifically for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/quiz" className="w-full sm:w-auto">
              <div className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200 rounded-2xl px-10 py-5 font-black text-xl flex items-center justify-center transition-all hover:-translate-y-1 active:scale-95">
                Get My Routine
                <ArrowRight className="ml-2 h-6 w-6" />
              </div>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 pt-10">
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <Microscope className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-bold text-slate-700">Porosity Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-700">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">Expert Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE-STEP PROCESS */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-16">The Path to Perfect Curls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg">1</div>
              <h3 className="text-xl font-bold mb-3">Diagnostic</h3>
              <p className="text-slate-600 text-sm">Tell us about your density, porosity, and current struggles in 2 minutes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg">2</div>
              <h3 className="text-xl font-bold mb-3">Custom Protocol</h3>
              <p className="text-slate-600 text-sm">Receive a personalized 90-day washing, styling, and sleeping schedule.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg">3</div>
              <h3 className="text-xl font-bold mb-3">Monthly Tracking</h3>
              <p className="text-slate-600 text-sm">Use our weekly check-in sheets to track growth and curl definition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FOOTER */}
      <section className="bg-slate-900 py-24 text-center px-4 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-500/10 blur-[100px] rounded-full"></div>
        <h2 className="text-4xl font-black text-white mb-6 relative z-10">Ready for your best hair year?</h2>
        <p className="text-slate-400 mb-10 text-lg relative z-10">Join 5,000+ others who stopped guessing and started their protocol.</p>
        <Link 
          href="/quiz" 
          className="inline-block bg-pink-500 text-white font-black px-12 py-5 rounded-2xl shadow-xl hover:bg-pink-400 transition-all text-xl hover:-translate-y-1 relative z-10"
        >
          Take the Free Quiz
        </Link>
      </section>
      
    </div>
  );
}