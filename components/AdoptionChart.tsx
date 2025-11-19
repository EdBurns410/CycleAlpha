import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

const generateSCurve = () => {
  const data = [];
  // Logistic function parameters
  const L = 100; // Max adoption %
  const k = 0.15; // Steepness
  const x0 = 0; // Midpoint

  for (let i = -40; i <= 40; i += 2) {
    const y = L / (1 + Math.exp(-k * (i - x0)));
    data.push({
      x: i,
      adoption: y,
      label: i === 0 ? 'Mainstream Tipping Point' : ''
    });
  }
  return data;
};

const DATA = generateSCurve();

const AdoptionChart: React.FC = () => {
  // Current position estimation (mock)
  const currentX = -10; // Early Majority
  const currentY = 100 / (1 + Math.exp(-0.15 * (-10)));

  return (
    <div className="w-full h-[300px] bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-white">Global Adoption S-Curve</h3>
        <p className="text-xs text-slate-400">Estimated position based on user growth & market cap.</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAdoption" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="x" hide />
          <YAxis stroke="#94a3b8" domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
            formatter={(val: number) => `${val.toFixed(1)}%`}
            labelFormatter={() => ''}
          />
          <Area 
            type="monotone" 
            dataKey="adoption" 
            stroke="#0ea5e9" 
            fillOpacity={1} 
            fill="url(#colorAdoption)" 
          />
          <ReferenceDot x={currentX} y={currentY} r={6} fill="#f43f5e" stroke="none" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-between text-xs text-slate-500 px-4">
        <span>Innovators</span>
        <span>Early Adopters</span>
        <span className="text-rose-400 font-bold">You Are Here</span>
        <span>Late Majority</span>
        <span>Laggards</span>
      </div>
    </div>
  );
};

export default AdoptionChart;