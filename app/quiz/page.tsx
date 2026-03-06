import QuizComponent from './../components/QuizComponent';
import Link from 'next/link';

export const metadata = {
  title: 'Science-Backed Tricho-Diagnostic | CurlyHairGuide',
  description: 'In-depth, 15-question hair analysis. Stop guessing. Start growing. Find your custom 90-day washing, styling, and sleeping schedule.',
  openGraph: {
    title: 'Stop Guessing. Start Growing. | AI Hair Diagnostic',
    description: 'I just finished my hair diagnostic. Take the quiz to get your custom 90-day protocol.',
    type: 'website',
    // Update this URL once you buy the curlyhairguide.com domain
    url: 'https://curlyhairguide.com/quiz', 
    images: [
      {
        url: '/og-image.jpg', // Place an image with this name in your /public folder later
        width: 1200,
        height: 630,
        alt: 'Curly Hair Diagnostic Tool Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curly Hair Routine Diagnostic',
    description: 'Get your custom-built prescription in under 2 minutes.',
  },
};

export default function HairQuizPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-4">
      
      {/* Brand Header */}
      <Link href="/" className="mb-10 opacity-50 flex items-center gap-2 group">
          <div className="bg-pink-500 text-white w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-sm group-hover:bg-pink-600 transition-colors">C</div>
          <span className="font-bold text-slate-900 text-sm italic">CurlyHairGuide</span>
      </Link>

      <div className="max-w-xl w-full text-center mb-10">
        <h1 className="text-4xl font-serif font-black text-slate-900 leading-tight">
          AI-Driven Hair Routine Diagnostic
        </h1>
        <p className="text-slate-500 mt-3 max-w-lg mx-auto leading-relaxed">
          Stop Guessing. Start Growing. Our 15-question tricho-analysis identifies your density, texture, and porosity in under 2 minutes. Get your custom science-backed prescription instantly.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        {/* We are importing the upgraded 15-question component here */}
        <QuizComponent />
      </div>

    </div>
  );
}