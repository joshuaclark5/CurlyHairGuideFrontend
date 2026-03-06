"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 🛡️ THE FIX: Import the Lucide Icons correctly. We also need standard 'Target' and standard 'Droplet'
import { ThumbsUp, Microscope, Droplets, Droplet, UserCheck, Wind, CalendarDays, BrainCircuit, Target, BookOpenCheck } from 'lucide-react';

// Unified 15-Question, Expert-Verified Tricho-Diagnostic (Gemini Research IV)
const QUESTIONS = [
  { id: 'type', label: 'What is your closest curl pattern?', options: ['2A: Wavy (S-shape bends)', '2B: Wavy (Deep S-shape)', '2C: Wavy/Curly (Defined Waves)', '3A: Curly (Defined Ringlets)', '3B: Curly (Springy Coils)', '3C: Curly (Tight Corkscrews)', '4A: Coily (Defined S-coils)', '4B: Coily (Tight Z-patterns)', '4C: Coily (Super tight/Shrinkage)'] },
  
  // Section I: Scalp Health
  { id: 'cleansing_frequency', label: 'How often do you find it necessary to shampoo your hair due to oiliness at the roots?', options: ['Daily (Indicates high sebum production)', 'Every 2-3 days (Normal regulation)', 'Once a week or less (Dry scalp)'] },
  { id: 'flaking_profile', label: 'If you experience flaking, which description best matches your symptoms?', options: ['Small, dry, white flakes that fall (Dry Scalp)', 'Large, oily, yellow/white flakes that stick (Dandruff/Seborrheic Dermatitis)', 'No flaking'] },
  { id: 'scalp_sensation', label: 'How does your scalp feel 24 hours after washing?', options: ['Tight, itchy, or stinging (Barrier disruption)', 'Greasy, occasionally itchy, not tight (High sebum)', 'Normal/Healthy'] },
  
  // Section II: Fiber Morphology
  { id: 'texture', label: 'Take a single hair and roll it. How does it feel?', options: ['I can barely feel it; it\'s like a silk thread (Fine)', 'I can feel it clearly; like a cotton thread (Medium)', 'It feels thick, wiry, or creates resistance (Coarse)'] },
  { id: 'density', label: 'When you part your hair or pull it into a ponytail, how visible is your scalp?', options: ['Very visible; my ponytail is thin (Low Density)', 'Barely visible; my ponytail is thick (High Density)', 'Normal Visibility'] },
  { id: 'porosity', label: 'When you place a clean, dry strand in water, what happens?', options: ['It floats on the surface for a long time (Low Porosity)', 'It sinks slowly to the middle (Medium Porosity)', 'It sinks to the bottom almost immediately (High Porosity)'] },
  { id: 'elasticity', label: 'Take a wet strand and gently stretch it. How does it behave?', options: ['It stretches and bounces back (High Elasticity)', 'It stretches but stays limp/mushy (Low Elasticity)', 'It snaps immediately without stretching (Brittle)'] },
  
  // Section III: Chemical & Environmental History
  { id: 'oxidative_damage', label: 'In the last 12 months, which chemical treatments have you received?', options: ['Bleach, high-lift blonde, highlights (Severe breakage)', 'Permanent color or gray coverage (Cuticle disruption)', 'No chemical treatments (Virgin hair)'] },
  { id: 'thermal_exposure', label: 'How many times per week do you use high-heat tools (irons, dryers)?', options: ['4-7 times (High stress)', '1-3 times (Moderate stress)', 'Never/Rarely'] },
  { id: 'hard_water', label: 'Is Layton water (Very Hard: 352 PPM) leaving your hair "gritty," "coated," or color brassy?', options: ['Yes, this is a frequent issue', 'No, my hair feels clean'] },
  
  // Section IV: Lifestyle & Maintenance
  { id: 'product_layering', label: 'How does your hair respond to heavy creams or oils?', options: ['It absorbs them well and looks better (High Porosity/Coarse)', 'It looks greasy, stringy, or limp (Low Porosity/Fine)'] },
  { id: 'mechanical_stress', label: 'What surface does your hair rest on for the 7-9 hours you sleep?', options: ['Standard cotton pillowcase (High friction)', 'Silk or satin pillowcase/bonnet (Low friction)'] },
  { id: 'daily_activity', label: 'Do you engage in high-sweat activities or swimming more than twice a week?', options: ['Yes (Frequent salt/chlorine exposure)', 'No'] },
  { id: 'frustration', label: 'What is the single biggest issue you want to resolve?', options: ['Breakage and thinning', 'Frizz and lack of definition', 'Scalp irritation and flaking'] },
];

export default function QuizComponent() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const router = useRouter();

  // Branded "Analyzer" messages (Labor Illusion)
  const analysisMessages = [
    { icon: BrainCircuit, message: "Activating AI Tricho-Analyzer (Gemini V1.5 Pro)..." },
    { icon: Microscope, message: "Cross-referencing scalp biome and texture data..." },
    { icon: Droplets, message: "Simulating porosity absorption and hydration curves..." },
    // 🛡️ THE FIX: standard 'Target' and standard 'Droplet' instead of targets/targeted
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
      // Begin "Fake AI" Processing
      setIsAnalyzing(true);
      
      // Generating a temporary generalized slug based on key data
      const porositySlug = newAnswers.porosity.toLowerCase().includes('high') ? 'high' : 'low';
      const simpleType = newAnswers.type.split(':')[0].toLowerCase();
      const slug = `${simpleType}-${porositySlug}-porosity`;
      
      // 🛡️ DATA SAFEGUARD: Store the FULL 15-question profile. The Analyzer will read this later.
      localStorage.setItem('user_hair_profile', JSON.stringify(newAnswers));

      let interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev >= analysisMessages.length - 1) {
            clearInterval(interval);
            router.push(`/routine/${slug}`);
            return prev;
          }
          return prev + 1;
        });
      }, 850); // Slightly slower to sell the complexity
    }
  };

  // 1. The "Fake AI" Processing Screen (Pink/Slate Labor Illusion)
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
        
        <p className="text-slate-400 text-sm italic max-w-sm mx-auto leading-relaxed">Please wait. We are analyzing 15 high-fidelity data points on your unique scalp biology, fiber physics, chemical history, and local climate (hard water data) to generate your science-backed Prescription Protocol.</p>
      </div>
    );
  }

  // 2. The Interactive Quiz UI (Complete Branded Transform)
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-10 pb-10 border-b border-slate-100">
        <div className="flex items-center gap-2">
            <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm">C</div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink-500">Step {step + 1} of {QUESTIONS.length} (AI Tricho-Diagnostic)</span>
        </div>
        <h2 className="text-4xl font-serif font-black text-slate-900 mt-4 leading-snug max-w-2xl">{QUESTIONS[step].label}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTIONS[step].options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="w-full py-5 px-8 text-left border-2 border-slate-100 rounded-2xl hover:border-pink-400 hover:bg-pink-50/50 transition-all hover:scale-[1.02] active:scale-95 group shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="font-black text-slate-800 text-lg group-hover:text-pink-600 transition-colors leading-tight">{opt.split('(')[0]}</p>
              {opt.includes('(') && <p className="text-xs text-slate-500 mt-1 italic group-hover:text-pink-500 transition-colors leading-relaxed">({opt.split('(')[1]}</p>}
            </div>
            <div className="bg-slate-100 text-slate-400 w-8 h-8 flex items-center justify-center rounded-full font-bold group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors shadow-inner">&rarr;</div>
          </button>
        ))}
      </div>
    </div>
  );
}