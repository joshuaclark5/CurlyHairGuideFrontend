"use client";
import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Microscope, Lock, Sparkles, MapPin, CheckCircle } from 'lucide-react';

function AnalyzeContent() {
  const [profile, setProfile] = useState<any>(null);
  const [protocol, setProtocol] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(true); 
  const [progress, setProgress] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [userLocation, setUserLocation] = useState('Detecting...');
  const [emailSent, setEmailSent] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = "March 9, 2026";
  const fulfillmentTriggered = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const storedProfile = localStorage.getItem('user_hair_profile');
    
    if (sessionId) setIsPaid(true);

    if (!storedProfile) {
      router.push('/quiz');
      return;
    }
    const parsedProfile = JSON.parse(storedProfile);
    setProfile(parsedProfile);

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setUserLocation(`${data.city}, ${data.region}`))
      .catch(() => setUserLocation('Layton, UT'));

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
          const formattedProtocol = data.protocol
            .replace(/\n\n/g, '<br/><br/>') 
            .replace(/\n/g, '<br/>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/•/g, '<br/>•')
            .replace(/###/g, '')
            .replace(/#/g, '');
          
          setProtocol(formattedProtocol);
          setProgress(100);
          setTimeout(() => setIsAnalyzing(false), 500);

          // 🚀 DISPATCH EMAIL AFTER SUCCESSFUL PAYMENT
          if (sessionId && !fulfillmentTriggered.current) {
            fulfillmentTriggered.current = true;
            await fetch('/api/generate-protocol/send-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: parsedProfile.email, 
                protocol: data.protocol 
              }),
            });
            setEmailSent(true);
          }
        }
      } catch (error) { 
        console.error("Fulfillment Error:", error); 
      } finally { 
        clearInterval(progressInterval); 
      }
    }

    generateAndFulfill();
    return () => clearInterval(progressInterval);
  }, [router, searchParams]);

  const handleCheckout = async () => {
    try {
      window.focus();
      const response = await fetch('/api/generate-protocol/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile?.email }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Checkout Error: ${data.error || "Unable to load Stripe"}`);
      }
    } catch (err: any) { 
      alert("Please open in a standard browser window (No Incognito)."); 
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-white text-center">
        <div className="relative w-32 h-32 mb-8">
           <div className="absolute inset-0 border-4 border-slate-50 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 text-xl tracking-tighter">{progress}%</div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 italic uppercase tracking-widest animate-pulse">Synthesizing...</h2>
      </div>
    );
  }

  const sections = protocol.split('---').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 lg:px-24 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
        
        <div className="border-b border-slate-100 pb-10">
          <div className="flex items-center gap-2 text-pink-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-4">
            <Sparkles size={14} /> Diagnostic Analysis
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight text-slate-900">Your Molecular Assessment</h1>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full font-bold text-[11px] border border-slate-100">
              <MapPin size={14} className="text-pink-400" /> {userLocation}
            </span>
            <span className="text-slate-300 text-[11px] font-bold md:ml-auto uppercase tracking-widest">{currentDate}</span>
          </div>
          {emailSent && (
            <div className="mt-6 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm font-bold">
              <CheckCircle size={18} /> Protocol Sent to {profile?.email}
            </div>
          )}
        </div>

        <div className="relative bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-10 flex items-center gap-2 italic">
              <Microscope size={24} className="text-pink-500" /> SECTION I: Biological Assessment
            </h2>
            <div 
              className={`prose prose-slate prose-lg max-w-none text-slate-600 leading-[1.9] ${!isPaid ? 'max-h-[550px] overflow-hidden' : ''}`}
              dangerouslySetInnerHTML={{ __html: (sections[0] || '') }}
            />

            {!isPaid && (
              <div className="absolute bottom-0 left-0 w-full h-[450px] bg-gradient-to-t from-white via-white/98 to-transparent z-10 flex flex-col items-center justify-end pb-16">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 text-center max-w-md mx-4">
                  <Lock className="text-pink-500 mx-auto mb-4" size={32} />
                  <h3 className="text-3xl font-black text-slate-900 mb-3 italic tracking-tight uppercase">Analysis Interrupted.</h3>
                  <button 
                    onClick={handleCheckout} 
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-5 px-12 rounded-2xl text-xl shadow-xl transition-all hover:scale-[1.03] active:scale-95"
                  >
                    Unlock Full Protocol ($29)
                  </button>
                </div>
              </div>
            )}
        </div>

        {isPaid && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {sections[1] && (
              <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-100">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-10 italic">SECTION II: 90-Day Clinical Schedule</h2>
                <div className="prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: sections[1] }} />
              </div>
            )}
            {sections[2] && (
              <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-100">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-10 italic">SECTION III: Tool Kit</h2>
                <div className="prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: sections[2] }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return <Suspense fallback={null}><AnalyzeContent /></Suspense>;
}