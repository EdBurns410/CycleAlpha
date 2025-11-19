import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { MOCK_CYCLE_DATA } from '../constants';

const COLORS = ['#94a3b8', '#cbd5e1', '#38bdf8', '#f43f5e']; // Grey, Light Grey, Blue (Current), Red

const CycleChart: React.FC = () => {
  // Transform data for Recharts: need a single array of objects with keys for each cycle
  const chartData = useMemo(() => {
    const maxLength = 1500; // Max days to show
    const data = [];

    for (let i = 0; i < maxLength; i += 7) { // Sample every 7 days for performance
      const point: any = { days: i };
      let hasData = false;
      
      Object.keys(MOCK_CYCLE_DATA).forEach((key, index) => {
        const cyclePoints = MOCK_CYCLE_DATA[key];
        const matchingPoint = cyclePoints.find(p => p.daysSinceHalving >= i && p.daysSinceHalving < i + 7);
        if (matchingPoint) {
          point[key] = matchingPoint.priceMultiplier;
          hasData = true;
        }
      });

      if (hasData) data.push(point);
    }
    return data;
  }, []);

  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Cycle Comparison (Price Multiplier)</h3>
        <div className="text-xs text-slate-400">X: Days Since Halving | Y: Multiplier (1.0 = Start)</div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="days" 
            stroke="#94a3b8" 
            label={{ value: 'Days Since Halving', position: 'insideBottomRight', offset: -5, fill: '#64748b' }} 
          />
          <YAxis 
            stroke="#94a3b8" 
            scale="log" 
            domain={['auto', 'auto']} 
            allowDataOverflow 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
            formatter={(value: number) => [`${value.toFixed(2)}x`, 'Multiplier']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {Object.keys(MOCK_CYCLE_DATA).map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={index === 3 ? 3 : 2} // Highlight current cycle
              dot={false}
              activeDot={{ r: 6 }}
              opacity={index === 3 ? 1 : 0.6}
            />
          ))}
          
          {/* Mark halving day */}
          <ReferenceLine x={0} stroke="#10b981" label="Halving" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CycleChart;