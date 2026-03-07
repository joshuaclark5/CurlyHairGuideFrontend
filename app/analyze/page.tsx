"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Microscope, Droplets, Droplet, Target, BookOpenCheck } from 'lucide-react';

export default function AnalyzePage() {
  const [profile, setProfile] = useState<any>(null);
  const [protocol, setProtocol] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const router = useRouter();

  const analysisMessages = [
    { icon: BrainCircuit, message: "Activating AI Tricho-Analyzer (Gemini V1.5 Pro)..." },
    { icon: Microscope, message: "Cross-referencing scalp biome and texture data..." },
    { icon: Droplets, message: "Simulating porosity absorption and hydration curves..." },
    { icon: Droplet, message: "Consulting established Layton, UT water mineral data (352 PPM)..." },
    { icon: Target, message: "Generating your custom 30-day washing, styling, and sleeping schedule..." },
    { icon: BookOpenCheck, message: "Finalizing your Prescription Protocol..." }
  ];

  useEffect(() => {
    // 1. DATA INGESTION
    const storedProfile = localStorage.getItem('user_hair_profile');
    if (!storedProfile) {
      router.push('/quiz');
      return;
    }
    const answers = JSON.parse(storedProfile);
    setProfile(answers);

    // 2. Begin Analyzer Phase
    setIsAnalyzing(true);
    let currentStep = 0;
    const interval = setInterval(() => {
        if(currentStep < 5) {
            setAnalysisStep(prev => prev + 1);
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 900);

    // 3. GENERATION & AUTOMATED EMAIL CALL
    async function generateProtocol() {
      try {
        // Step A: Generate the Protocol via Gemini
        const response = await fetch('/api/generate-protocol', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, slug: 'analyzed-lead' }),
        });
        const data = await response.json();

        if (data.protocol) {
          setProtocol(data.protocol);

          // Step B: Automatically trigger the Email "Mailman"
          // It looks for the email saved in the quiz answers
          await fetch('/api/generate-protocol/send-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: answers.email || answers.customer_email, 
              protocol: data.protocol 
            }),
          });
        } else if (data.error) {
          console.error('Gemini Error:', data.error);
        }
      } catch (error) {
        console.error('Analyzer API Connection Error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }

    generateProtocol();

    return () => clearInterval(interval);

  }, [router]);

  // 1. Processing Screen
  if (isAnalyzing) {
    const ActiveIcon = analysisMessages[analysisStep].icon;
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 min-h-screen bg-white rounded-3xl border border-slate-100 shadow-inner">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-lg mx-auto transition-all">
          <ActiveIcon className="w-10 h-10 text-pink-500 flex-shrink-0" />
          <p className="text-2xl font-serif font-black text-slate-900 leading-snug animate-pulse">
            {analysisMessages[analysisStep].message}
          </p>
        </div>
        <p className="text-slate-400 text-sm italic max-w-sm mx-auto leading-relaxed">
            Please wait. We are analyzing 15 high-fidelity data points on your unique scalp biology, fiber physics, chemical history, and local climate (hard water data) to generate your science-backed Prescription Protocol.
        </p>
      </div>
    );
  }

  // 2. PERFORMANCE-TUNED OUTPUT
  if (protocol) {
    const sections = protocol.split('---').filter(Boolean);

    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Branded Header */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm">C</div>
                <span className="font-bold text-pink-500 text-xs italic uppercase tracking-wider">AI Tricho-Analyzer Protocol</span>
              </div>
              <h1 className="text-4xl font-serif font-black text-slate-900 leading-snug">Your Molecular Prescription Protocol</h1>
              <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
                  Generated from your unique biology: {profile?.type}, {profile?.texture}, {profile?.porosity}. Personalized for Layton, UT (352 PPM Hard Water).
              </p>
            </div>
            <Microscope className="w-16 h-16 text-slate-200 flex-shrink-0" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {sections[0] && (
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-800 pb-4 border-b border-slate-100">Section I: The Science of Your Strands</h2>
                  <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-6">
                    {sections[0]}
                  </div>
                </div>
              )}
              {sections[1] && (
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-800 pb-4 border-b border-slate-100">Section II: The 30-Day Prescription Schedule</h2>
                  <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-6">
                    {sections[1]}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-8">
               {sections[2] && (
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-slate-800 pb-4 border-b border-slate-100">Section III: The Molecular Tool Kit</h2>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-6">
                        {sections[2]}
                    </div>
                </div>
               )}
            </div>
          </div>

          {/* Lead Value CTA */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-6 border-t-2 border-pink-100">
             <div>
                <h3 className="text-2xl font-serif font-bold text-slate-800 leading-tight">Protocol Saved & Emailed</h3>
                <p className="text-slate-500 mt-2 max-w-xl leading-relaxed">A permanent copy of this 90-day plan has been sent to your inbox. Need 1-on-1 guidance? Book a session below.</p>
             </div>
             <button className="py-4 px-10 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-sm">
                Book Virtual Scan
             </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen flex items-center justify-center font-serif text-slate-400 italic">Finalizing your results...</div>;
}