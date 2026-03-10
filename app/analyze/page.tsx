"use client";
import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Microscope, Lock, Sparkles, MapPin, CheckCircle, Printer, Calendar, ShoppingBag } from 'lucide-react';

function AnalyzeContent() {
  const [profile, setProfile] = useState<any>(null);
  const [protocol, setProtocol] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(true); 
  const [progress, setProgress] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [userLocation, setUserLocation] = useState('Detecting...');
  const [emailSent, setEmailSent] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = "March 9, 2026";
  const fulfillmentTriggered = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const storedProfile = localStorage.getItem('user_hair_profile');
    if (sessionId) setIsPaid(true);
    if (!storedProfile) { router.push('/quiz'); return; }
    const parsedProfile = JSON.parse(storedProfile);
    setProfile(parsedProfile);

    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => setUserLocation(`${data.city}, ${data.region}`)).catch(() => setUserLocation('Layton, UT'));

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 99.9 ? parseFloat((prev + 0.9).toFixed(2)) : 99.9));
    }, 150);

    async function generateAndFulfill() {
      try {
        const response = await fetch('/api/generate-protocol', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: parsedProfile, slug: 'analyzed-lead', currentDate }),
        });
        const data = await response.json();
        
        if (data.protocol) {
          setProtocol(data.protocol); // We handle formatting in the JSX now
          setProgress(100);
          setTimeout(() => setIsAnalyzing(false), 500);

          if (sessionId && !fulfillmentTriggered.current) {
            fulfillmentTriggered.current = true;
            await fetch('/api/generate-protocol/send-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: parsedProfile.email, protocol: data.protocol }),
            });
            setEmailSent(true);
          }
        }
      } catch (error) { console.error(error); } finally { clearInterval(progressInterval); }
    }
    generateAndFulfill();
    return () => clearInterval(progressInterval);
  }, [router, searchParams]);

  const toggleStep = (step: string) => {
    setCompletedSteps(prev => prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]);
  };

  const handleCheckout = async () => {
    try {
      window.focus();
      const response = await fetch('/api/generate-protocol/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile?.email }),
      });
      const data = await response.json();
      if (data.url) { window.location.href = data.url; }
    } catch (err) { alert("Please use a standard browser window."); }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-white">
        <div className="relative w-32 h-32 mb-8">
           <div className="absolute inset-0 border-4 border-slate-50 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 text-xl">{progress}%</div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 italic uppercase tracking-widest animate-pulse">Synthesizing...</h2>
      </div>
    );
  }

  const sections = protocol.split('---').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 lg:px-24 font-sans text-[#1A1A1A] print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-4">
              <Sparkles size={14} /> Diagnostic Analysis
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight text-slate-900">Your Molecular Assessment</h1>
            <div className="flex items-center gap-4 mt-6">
              <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full font-bold text-[11px] border border-slate-100 italic">
                {userLocation}
              </span>
              <span className="text-slate-300 text-[11px] font-bold uppercase tracking-widest">{currentDate}</span>
            </div>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all print:hidden">
            <Printer size={16} /> DOWNLOAD PDF
          </button>
        </div>

        {/* SECTION I */}
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-8 flex items-center gap-2 italic">
            <Microscope size={24} className="text-pink-500" /> SECTION I: Biological Assessment
          </h2>
          <div 
            className={`prose prose-slate prose-lg max-w-none text-slate-600 leading-[1.9] ${!isPaid ? 'max-h-[400px] overflow-hidden' : ''}`}
            dangerouslySetInnerHTML={{ __html: sections[0]?.replace(/\n/g, '<br/>') }}
          />
          {!isPaid && (
            <div className="absolute bottom-0 left-0 w-full h-[350px] bg-gradient-to-t from-white via-white to-transparent flex flex-col items-center justify-end pb-12">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 text-center">
                <Lock className="text-pink-500 mx-auto mb-4" size={32} />
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase italic">Protocol Interrupted.</h3>
                <button onClick={handleCheckout} className="bg-pink-500 hover:bg-pink-600 text-white font-black py-4 px-10 rounded-2xl text-lg shadow-xl hover:scale-[1.03] transition-all">
                  Unlock Full 90-Day Plan ($29)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PAID CONTENT: SECTION II & III */}
        {isPaid && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* SECTION II: 12-WEEK SCHEDULE */}
            <div className="bg-slate-900 p-10 md:p-16 rounded-[2.5rem] text-white shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
                <h2 className="text-2xl font-serif font-bold italic flex items-center gap-3">
                  <Calendar className="text-pink-500" /> SECTION II: 90-Day Master Schedule
                </h2>
                <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 font-mono text-pink-400 text-xs">
                   SYSTEM STATUS: RECOVERY IN PROGRESS
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {sections[1]?.split('<h4>').filter(Boolean).map((week, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 relative group">
                    <div 
                      className="prose prose-invert max-w-none prose-h4:text-pink-400 prose-h4:text-xl prose-h4:mb-4 prose-li:mb-2 text-slate-300"
                      dangerouslySetInnerHTML={{ __html: '<h4>' + week }}
                    />
                    <button 
                      onClick={() => toggleStep(`week-${idx}`)}
                      className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${completedSteps.includes(`week-${idx}`) ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500 hover:text-white'}`}
                    >
                      <CheckCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION III: PRODUCT GRID */}
            <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-10 flex items-center gap-3 italic text-slate-800">
                <ShoppingBag className="text-pink-500" /> SECTION III: Prescription Tool Kit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections[2]?.split('\n').filter(line => line.includes('|')).map((line, i) => {
                  const [name, brand, link] = line.split('|');
                  return (
                    <a href={link.trim()} target="_blank" key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-pink-300 hover:bg-pink-50 transition-all group">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{brand.trim()}</p>
                        <p className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors leading-tight">{name.trim()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-2xl shadow-sm text-pink-500 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={20} />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return <Suspense fallback={null}><AnalyzeContent /></Suspense>;
}