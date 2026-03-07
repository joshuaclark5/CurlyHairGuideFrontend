"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Microscope, Droplets, Droplet, BrainCircuit, Target, BookOpenCheck } from 'lucide-react';

const QUESTIONS = [
  { id: 'type', label: 'What is your closest curl pattern?', options: ['2A: Wavy (S-shape bends)', '2B: Wavy (Deep S-shape)', '2C: Wavy/Curly (Defined Waves)', '3A: Curly (Defined Ringlets)', '3B: Curly (Springy Coils)', '3C: Curly (Tight Corkscrews)', '4A: Coily (Defined S-coils)', '4B: Coily (Tight Z-patterns)', '4C: Coily (Super tight/Shrinkage)'] },
  { id: 'cleansing_frequency', label: 'How often do you shampoo due to oiliness?', options: ['Daily (High sebum)', 'Every 2-3 days (Normal)', 'Once a week or less (Dry)'] },
  { id: 'flaking_profile', label: 'Which best matches your flaking symptoms?', options: ['Small, dry, white flakes (Dry Scalp)', 'Large, oily, yellow/white flakes (Dandruff)', 'No flaking'] },
  { id: 'scalp_sensation', label: 'How does your scalp feel 24h after washing?', options: ['Tight, itchy, or stinging (Barrier disruption)', 'Greasy, occasionally itchy (High sebum)', 'Normal/Healthy'] },
  { id: 'texture', label: 'How does a single hair strand feel?', options: ['Like a silk thread (Fine)', 'Like a cotton thread (Medium)', 'Thick or wiry (Coarse)'] },
  { id: 'density', label: 'How visible is your scalp?', options: ['Very visible (Low Density)', 'Barely visible (High Density)', 'Normal Visibility'] },
  { id: 'porosity', label: 'What happens to a strand in water?', options: ['It floats (Low Porosity)', 'It sinks slowly (Medium Porosity)', 'It sinks immediately (High Porosity)'] },
  { id: 'elasticity', label: 'How does a wet strand stretch?', options: ['Stretches and bounces back (High Elasticity)', 'Stretches but stays limp (Low Elasticity)', 'Snaps immediately (Brittle)'] },
  { id: 'oxidative_damage', label: 'Chemical treatments in the last 12 months?', options: ['Bleach or high-lift blonde', 'Permanent color', 'No chemical treatments (Virgin)'] },
  { id: 'thermal_exposure', label: 'High-heat tool use per week?', options: ['4-7 times (High stress)', '1-3 times (Moderate stress)', 'Never/Rarely'] },
  { id: 'hard_water', label: 'Does Layton water (352 PPM) leave hair "gritty"?', options: ['Yes, frequently', 'No, feels clean'] },
  { id: 'product_layering', label: 'Response to heavy creams or oils?', options: ['Absorbs well (High Porosity)', 'Looks greasy/limp (Low Porosity)'] },
  { id: 'mechanical_stress', label: 'What surface does your hair rest on at night?', options: ['Cotton pillowcase (High friction)', 'Silk/Satin bonnet (Low friction)'] },
  { id: 'daily_activity', label: 'High-sweat or swimming >2x a week?', options: ['Yes (Frequent exposure)', 'No'] },
  { id: 'frustration', label: 'Biggest issue to resolve?', options: ['Breakage and thinning', 'Frizz and definition', 'Scalp irritation'] },
];

export default function QuizComponent() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showEmailStep, setShowEmailStep] = useState(false);
  const router = useRouter();

  const analysisMessages = [
    { icon: BrainCircuit, message: "Activating AI Tricho-Analyzer (Gemini V1.5 Pro)..." },
    { icon: Microscope, message: "Cross-referencing scalp biome and texture data..." },
    { icon: Droplets, message: "Simulating porosity absorption and hydration curves..." },
    { icon: Droplet, message: "Consulting established Layton, UT water mineral data (352 PPM)..." },
    { icon: Target, message: "Generating your custom 30-day washing, styling, and sleeping schedule..." },
    { icon: BookOpenCheck, message: "Finalizing your Prescription Protocol..." }
  ];

  const handleAnswer = (answer: string) => {
    const currentQuestion = QUESTIONS[step].id;
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowEmailStep(true);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Save the complete profile with email to localStorage for the Analyze page
    const finalData = { ...answers, email };
    localStorage.setItem('user_hair_profile', JSON.stringify(finalData));

    let interval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= analysisMessages.length - 1) {
          clearInterval(interval);
          router.push('/analyze'); // 🚀 REDIRECT TO LIVE AI ENGINE
          return prev;
        }
        return prev + 1;
      });
    }, 850);
  };

  if (isAnalyzing) {
    const ActiveIcon = analysisMessages[analysisStep].icon;
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner min-h-[400px]">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-lg mx-auto transition-all">
          <ActiveIcon className="w-10 h-10 text-pink-500 flex-shrink-0" />
          <p className="text-2xl font-serif font-black text-slate-900 leading-snug animate-pulse">
            {analysisMessages[analysisStep].message}
          </p>
        </div>
      </div>
    );
  }

  if (showEmailStep) {
    return (
      <div className="max-w-xl mx-auto p-12 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-3xl font-serif font-black text-slate-900 mb-4">Where should we send your results?</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">Your 15-point analysis is complete. We are ready to generate your 30-page Prescription Protocol and 90-day calendar.</p>
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <input 
            type="email" 
            required 
            placeholder="Enter your email" 
            className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 outline-none focus:border-pink-500 transition-all text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-5 rounded-xl text-xl shadow-lg transition-all active:scale-95">
            Generate My Protocol &rarr;
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-10 pb-10 border-b border-slate-100">
        <div className="flex items-center gap-2">
            <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm">C</div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink-500">Step {step + 1} of {QUESTIONS.length}</span>
        </div>
        <h2 className="text-4xl font-serif font-black text-slate-900 mt-4 leading-snug max-w-2xl">{QUESTIONS[step].label}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTIONS[step].options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="w-full py-5 px-8 text-left border-2 border-slate-100 rounded-2xl hover:border-pink-400 hover:bg-pink-50/50 transition-all group shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="font-black text-slate-800 text-lg group-hover:text-pink-600 transition-colors leading-tight">{opt.split('(')[0]}</p>
              {opt.includes('(') && <p className="text-xs text-slate-500 mt-1 italic group-hover:text-pink-500">({opt.split('(')[1]}</p>}
            </div>
            <div className="bg-slate-100 text-slate-400 w-8 h-8 flex items-center justify-center rounded-full font-bold group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors shadow-inner">&rarr;</div>
          </button>
        ))}
      </div>
    </div>
  );
}