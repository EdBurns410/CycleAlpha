import React from 'react';
import { TradeTemplate } from '../types';

interface Props {
  template: TradeTemplate;
}

const TradeCard: React.FC<Props> = ({ template }) => {
  const riskColor = 
    template.riskLevel === 'CONSERVATIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
    template.riskLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
    'bg-rose-500/20 text-rose-400 border-rose-500/30';

  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 flex flex-col h-full hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded text-xs font-bold border ${riskColor}`}>
          {template.riskLevel}
        </span>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
          {template.type}
        </span>
      </div>
      
      <h4 className="text-lg font-bold text-white mb-1">{template.name}</h4>
      <p className="text-sm text-slate-300 mb-4 flex-grow">{template.description}</p>
      
      <div className="space-y-2 text-xs bg-slate-900/50 p-3 rounded border border-slate-700/50">
        <div className="flex justify-between">
          <span className="text-slate-400">Take Profit:</span>
          <span className="text-emerald-400 font-mono">+{template.exitConditions.tp * 100}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Stop Loss:</span>
          <span className="text-rose-400 font-mono">{template.exitConditions.sl * 100}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Horizon:</span>
          <span className="text-blue-400 font-mono">{template.exitConditions.timeHorizonDays} days</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Conditions</p>
        <div className="flex flex-wrap gap-1">
          {template.entryConditions.map((cond, i) => (
            <span key={i} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
              {cond}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeCard;