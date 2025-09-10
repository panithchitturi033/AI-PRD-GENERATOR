import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PRDDisplay } from './components/PRDDisplay';
import { generatePRD } from './services/geminiService';
import type { PRD } from './types';
import { InfoIcon, SparklesIcon } from './components/Icons';

// Let TypeScript know about the VANTA global from the script tag
declare global {
  interface Window {
    VANTA: any;
  }
}

const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [generatedPRD, setGeneratedPRD] = useState<PRD | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  // Effect for initializing VANTA
  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(window.VANTA.GLOBE({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xeab308, 
        backgroundColor: 0x0,
        size: 0.8,
      }));
    }
    // Cleanup function to destroy the effect on component unmount
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    }
  }, [vantaEffect]); 

  const handleGenerate = useCallback(async () => {
    if (!idea.trim()) {
      setError('Please enter a product idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPRD(null);

    try {
      const prd = await generatePRD(idea);
      setGeneratedPRD(prd);
    } catch (err) {
      console.error(err);
      setError('Failed to generate PRD. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [idea]);
  
  const handlePRDChange = useCallback((updatedPRD: PRD) => {
    setGeneratedPRD(updatedPRD);
  }, []);

  const exampleIdeas = [
    "A mobile app for local gardeners to trade seeds and produce.",
    "A platform that uses AI to create personalized travel itineraries.",
    "A smart water bottle that tracks hydration and reminds you to drink.",
    "A web-based tool for teams to create and share project roadmaps visually."
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col relative z-0 bg-black text-gray-200">
      <Header />
      <main className="flex-grow w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full bg-black/40 border border-yellow-500/20 rounded-2xl shadow-2xl shadow-yellow-500/10 backdrop-blur-lg p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2" style={{textShadow: '0 0 10px rgba(250, 204, 21, 0.5)'}}>Describe Your Product Idea</h2>
          <p className="text-center text-gray-400 mb-6">Enter a description, and let AI craft a detailed PRD for you.</p>

          <div className="relative w-full">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., A mobile app that connects local home cooks with people looking for homemade meals."
              className="w-full h-32 p-4 bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 resize-none focus:shadow-lg focus:shadow-yellow-400/20"
              disabled={isLoading}
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
             <h3 className="font-semibold mb-2 text-gray-300">Or try an example:</h3>
             <div className="flex flex-wrap gap-2">
                {exampleIdeas.map((ex, index) => (
                    <button 
                        key={index} 
                        onClick={() => setIdea(ex)} 
                        disabled={isLoading} 
                        className="px-3 py-1 bg-gray-800/60 border border-gray-700 hover:bg-gray-700/80 hover:border-yellow-500/50 text-gray-300 rounded-full text-xs transition-all duration-200"
                    >
                        {ex}
                    </button>
                ))}
             </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !idea.trim()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-yellow-400/40 disabled:bg-gray-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="text-black"/>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 transition-transform group-hover:rotate-12"/>
                  <span>Generate PRD</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 w-full bg-red-900/30 border border-red-700/50 text-red-300 p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm">
            <InfoIcon className="w-6 h-6 text-red-400"/>
            <p><span className="font-semibold">Oops!</span> {error}</p>
          </div>
        )}

        {isLoading && (
            <div className="mt-8 text-center text-yellow-400/80 animate-pulse">
                <p className="font-semibold">AI is thinking...</p>
                <p className="text-sm">Great product docs are worth the wait!</p>
            </div>
        )}

        {generatedPRD && !isLoading && (
          <div className="mt-8 w-full">
            <PRDDisplay prd={generatedPRD} setPrd={handlePRDChange} />
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-gray-600 text-sm">
        <p>Powered by Gemini. Built for modern product teams.</p>
      </footer>
    </div>
  );
};

export default App;