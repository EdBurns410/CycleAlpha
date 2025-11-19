import React, { useState, useEffect } from 'react';
import CycleChart from './components/CycleChart';
import AdoptionChart from './components/AdoptionChart';
import TradeCard from './components/TradeCard';
import Backtester from './components/Backtester';
import { analyzeContextWithGemini } from './services/geminiService';
import { DEFAULT_NEWS_SNIPPETS, DISCLAIMER, MOCK_CYCLE_DATA } from './constants';
import { AnalysisResult, TradeTemplate } from './types';

function App() {
  // State
  const [newsInput, setNewsInput] = useState(DEFAULT_NEWS_SNIPPETS.join('\n'));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SIMULATION'>('DASHBOARD');

  // Load initial analysis on mount (simulated)
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // We pass a summary of the cycle position to the AI
    const currentCycle = MOCK_CYCLE_DATA['Current Cycle'];
    const latestPoint = currentCycle[currentCycle.length - 1];
    const contextString = `Current Cycle Day: ${latestPoint.daysSinceHalving}. Price Multiplier: ${latestPoint.priceMultiplier}x.`;
    
    const result = await analyzeContextWithGemini(newsInput, contextString);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              α
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">CycleAlpha</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('DASHBOARD')}
              className={`transition-colors ${activeTab === 'DASHBOARD' ? 'text-primary-400' : 'text-slate-400 hover:text-white'}`}
            >
              Live Analysis
            </button>
            <button 
               onClick={() => setActiveTab('SIMULATION')}
               className={`transition-colors ${activeTab === 'SIMULATION' ? 'text-primary-400' : 'text-slate-400 hover:text-white'}`}
            >
              Backtest Lab
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Disclaimer */}
        <div className="mb-8 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-500/80 text-center">
          {DISCLAIMER}
        </div>

        {/* Tab: Dashboard */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-8">
            
            {/* Top Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CycleChart />
              </div>
              <div className="lg:col-span-1">
                <AdoptionChart />
              </div>
            </div>

            {/* Middle Row: AI Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Input Column */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <h3 className="text-white font-semibold mb-3">Market Context / News</h3>
                  <textarea
                    className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none font-mono"
                    value={newsInput}
                    onChange={(e) => setNewsInput(e.target.value)}
                    placeholder="Paste recent headlines or macro events here..."
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="mt-3 w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Context...
                      </>
                    ) : 'Analyze Cycle & Narrative'}
                  </button>
                </div>
              </div>

              {/* Output Column */}
              <div className="lg:col-span-2">
                {analysis ? (
                  <div className="space-y-6">
                    {/* Analysis Summary Badge */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                         <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Cycle Phase</div>
                          <div className="text-primary-400 font-bold">{analysis.cyclePhase}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Narrative</div>
                          <div className="text-white font-bold">{analysis.narrativeRegime}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Deviation</div>
                          <div className={`${analysis.priceDeviationFromMedian > 0 ? 'text-emerald-400' : 'text-rose-400'} font-mono`}>
                            {analysis.priceDeviationFromMedian > 0 ? '+' : ''}{analysis.priceDeviationFromMedian}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Cycle Age</div>
                          <div className="text-slate-300 font-mono">{analysis.daysSinceHalving} Days</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                        {analysis.summary}
                      </p>
                    </div>

                    {/* Trade Templates */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        Suggested Trade Structures
                        <span className="text-[10px] bg-primary-900 text-primary-300 px-2 py-0.5 rounded-full">Hypothetical</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.recommendedTemplates.map((template, i) => (
                          <TradeCard key={i} template={template} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900/30 border border-slate-800 border-dashed rounded-xl">
                    <div className="text-slate-600 text-center p-8">
                      <p>Run analysis to generate cycle insights and trade templates.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Simulation */}
        {activeTab === 'SIMULATION' && (
          <div className="max-w-4xl mx-auto">
             {analysis ? (
               <Backtester templates={analysis.recommendedTemplates} />
             ) : (
               <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
                 <h3 className="text-xl text-white font-bold mb-2">No Active Templates</h3>
                 <p className="text-slate-400 mb-6">Please go to the dashboard and analyze the market to generate trade templates first.</p>
                 <button 
                   onClick={() => setActiveTab('DASHBOARD')}
                   className="text-primary-400 hover:text-primary-300 underline"
                 >
                   Go to Dashboard
                 </button>
               </div>
             )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;