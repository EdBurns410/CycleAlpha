import React, { useState } from 'react';
import { TradeTemplate, SimulationResult } from '../types';
import { runSimulation } from '../services/analysisService';
import { MOCK_CYCLE_DATA } from '../constants';

interface Props {
  templates: TradeTemplate[];
}

const Backtester: React.FC<Props> = ({ templates }) => {
  // Default to a date in the past where we have data
  const [simDate, setSimDate] = useState('2021-05-01');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setResults([]);

    // Simulate a small delay for "processing" feel
    setTimeout(() => {
      const newResults = templates.map(temp => runSimulation(temp, simDate));
      setResults(newResults);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historical Simulator
        </h3>
        <p className="text-slate-400 mb-6 text-sm">
          "Travel back in time" to see how these trade templates would have performed starting from a specific historical date.
          The system uses only data available up to the selected date to open the trade, then uses subsequent data to determine the outcome.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Simulation Start Date</label>
            <input 
              type="date" 
              value={simDate}
              onChange={(e) => setSimDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded px-4 py-2 w-full focus:outline-none focus:border-primary-500"
              min="2013-01-01"
              max="2024-12-31"
            />
          </div>
          <button
            onClick={handleRun}
            disabled={isRunning || templates.length === 0}
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-6 rounded transition-all"
          >
            {isRunning ? 'Simulating...' : 'Run Backtest'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {results.map((res, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className={`p-4 border-b border-slate-800 flex justify-between items-center ${
                res.outcome === 'WIN' ? 'bg-emerald-900/10' : 
                res.outcome === 'LOSS' ? 'bg-rose-900/10' : 'bg-slate-800'
              }`}>
                <span className="font-bold text-white">{res.tradeName}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  res.outcome === 'WIN' ? 'bg-emerald-500 text-white' : 
                  res.outcome === 'LOSS' ? 'bg-rose-500 text-white' : 'bg-slate-600 text-slate-200'
                }`}>
                  {res.outcome}
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">PnL</span>
                  <span className={`text-lg font-mono font-bold ${res.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {res.pnlPercent > 0 ? '+' : ''}{res.pnlPercent.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Max Drawdown</span>
                  <span className="text-lg font-mono font-bold text-rose-400">
                    {res.maxDrawdown.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Duration</span>
                  <span className="text-white font-mono">{res.durationDays} days</span>
                </div>
                 <div>
                  <span className="text-slate-500 block text-xs">Entry / Exit</span>
                  <span className="text-white font-mono">${res.entryPrice.toFixed(0)} / ${res.exitPrice.toFixed(0)}</span>
                </div>
              </div>
              <div className="bg-black/20 p-3 text-xs font-mono text-slate-400 border-t border-slate-800 max-h-24 overflow-y-auto">
                 {res.logs.map((log, i) => <div key={i}>&gt; {log}</div>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Backtester;