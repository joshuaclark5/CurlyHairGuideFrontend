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
    if (localStorage.getItem('hair_progress')) setCompletedSteps(JSON.parse(localStorage.getItem('hair_progress')!));

    if (!storedProfile) { router.push('/quiz'); return; }
    setProfile(JSON.parse(storedProfile));

    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => setUserLocation(`${data.city}, ${data.region}`)).catch(() => setUserLocation('Layton, UT'));

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 99.9 ? parseFloat((prev + 0.9).toFixed(2)) : 99.9));
    }, 150);

    async function generateAndFulfill() {
      try {
        const response = await fetch('/api/generate-protocol', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: JSON.parse(storedProfile!), slug: 'analyzed-lead', currentDate }),
        });
        const data = await response.json();
        
        if (data.protocol) {
          setProtocol(data.protocol);
          setProgress(100);
          setTimeout(() => setIsAnalyzing(false), 500);

          if (sessionId && !fulfillmentTriggered.current) {
            fulfillmentTriggered.current = true;
            await fetch('/api/generate-protocol/send-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: JSON.parse(storedProfile!).email, protocol: data.protocol }),
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
    const newSteps = completedSteps.includes(step) ? completedSteps.filter(s => s !== step) : [...completedSteps, step];
    setCompletedSteps(newSteps);
    localStorage.setItem('hair_progress', JSON.stringify(newSteps));
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/generate-protocol/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile?.email }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { alert("Checkout error. Try a standard browser window."); }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-white text-center">
        <div className="relative w-32 h-32 mb-8">
           <div className="absolute inset-0 border-4 border-slate-50 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 text-xl tracking-tighter">{progress}%</div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 tracking-tight italic uppercase tracking-widest animate-pulse">Analyzing Biology...</h2>
      </div>
    );
  }

  const sections = protocol.split('---').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 lg:px-24 font-sans text-[#1A1A1A] print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-4">
              <Sparkles size={14} /> Diagnostic Analysis
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight text-slate-900 tracking-tight italic">Your Molecular Assessment</h1>
            <div className="flex items-center gap-4 mt-6">
              <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full font-bold text-[11px] border border-slate-100 italic">
                <MapPin size={12} className="inline mr-1 text-pink-400" /> {userLocation}
              </span>
              <span className="text-slate-300 text-[11px] font-bold uppercase tracking-widest">{currentDate}</span>
            </div>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all print:hidden">
            <Printer size={16} /> DOWNLOAD PDF
          </button>
        </div>

        {/* SECTION I: BIO ASSESSMENT */}
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-10 flex items-center gap-2 italic">
              <Microscope size={24} className="text-pink-500" /> SECTION I: Biological Assessment
            </h2>
            <div 
              className={`prose prose-slate prose-lg max-w-none text-slate-600 leading-[1.9] ${!isPaid ? 'max-h-[450px] overflow-hidden' : ''}`}
              dangerouslySetInnerHTML={{ __html: sections[0]?.replace(/\n/g, '<br/>') }}
            />
            {!isPaid && (
              <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-white via-white to-transparent z-10 flex flex-col items-center justify-end pb-16">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 text-center max-w-md mx-4">
                  <Lock className="text-pink-500 mx-auto mb-4" size={32} />
                  <h3 className="text-2xl font-black text-slate-900 mb-6 italic uppercase tracking-tight">Analysis Interrupted.</h3>
                  <button onClick={handleCheckout} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-5 px-12 rounded-2xl text-xl shadow-xl hover:scale-[1.03] transition-all">
                    Unlock Full 90-Day Plan ($29)
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* PAID CONTENT: SECTION II & III */}
        {isPaid && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* 12-WEEK ROADMAP */}
            <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl border border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <h2 className="text-3xl font-serif font-bold italic text-pink-400 flex items-center gap-3 uppercase tracking-tighter">
                   <Calendar size={28} /> The 90-Day Roadmap
                </h2>
                <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700">
                   <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total Progress</p>
                   <p className="font-mono text-pink-500 text-xl tracking-tighter">
                     {((completedSteps.length / 12) * 100).toFixed(0)}%
                   </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {sections[1]?.split('<h4>').filter(Boolean).map((week, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep(`week-${idx}`)}
                    className={`cursor-pointer transition-all duration-300 p-8 rounded-[2rem] border-2 flex items-start gap-6 ${completedSteps.includes(`week-${idx}`) ? 'bg-pink-500/10 border-pink-500/50 opacity-60 scale-[0.98]' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div className={`mt-1 p-1 rounded-full border-2 ${completedSteps.includes(`week-${idx}`) ? 'bg-pink-500 border-pink-500' : 'border-slate-600'}`}>
                      <CheckCircle size={20} className={completedSteps.includes(`week-${idx}`) ? 'text-white' : 'text-transparent'} />
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none prose-h4:text-pink-400 prose-h4:text-xl prose-h4:mb-4 prose-li:mb-2 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: '<h4>' + week }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCT TOOLKIT GRID */}
            <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-10 flex items-center gap-3 italic text-slate-800 uppercase tracking-tighter">
                <ShoppingBag className="text-pink-500" /> SECTION III: Prescription Tool Kit
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sections[2]?.split('\n').filter(line => line.includes('|')).map((line, i) => {
                  const [name, brand, link] = line.split('|');
                  return (
                    <a href={link.trim()} target="_blank" rel="noopener noreferrer" key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-pink-300 hover:bg-pink-50 transition-all group">
                      <div className="flex-1 pr-4">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{brand.trim()}</p>
                        <p className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors leading-tight">{name.trim()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-2xl shadow-sm text-pink-500 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
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