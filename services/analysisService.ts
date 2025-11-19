import { MOCK_CYCLE_DATA, HALVING_DATES } from '../constants';
import { CyclePoint, SimulationResult, TradeTemplate } from '../types';

// Find the cycle and data point corresponding to a specific historical date
export const getHistoricalContext = (dateStr: string) => {
  const targetDate = new Date(dateStr);
  
  // Find which cycle this date belongs to
  let activeCycleIndex = -1;
  for (let i = 0; i < HALVING_DATES.length; i++) {
    if (targetDate >= HALVING_DATES[i]) {
      activeCycleIndex = i;
    }
  }

  if (activeCycleIndex === -1) return null;

  const cycleKeys = Object.keys(MOCK_CYCLE_DATA);
  const currentCycleKey = cycleKeys[activeCycleIndex];
  const currentCycleData = MOCK_CYCLE_DATA[currentCycleKey];

  // Find the exact point in the cycle data
  // Since our mock data is generated daily from halving, we can approximate index
  const diffTime = Math.abs(targetDate.getTime() - HALVING_DATES[activeCycleIndex].getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  const point = currentCycleData.find(p => p.daysSinceHalving === diffDays) || currentCycleData[currentCycleData.length - 1];
  
  return {
    cycleName: currentCycleKey,
    point,
    fullCycleData: currentCycleData
  };
};

export const runSimulation = (
  trade: TradeTemplate,
  startDateStr: string,
): SimulationResult => {
  const context = getHistoricalContext(startDateStr);
  
  if (!context || !context.point) {
    return {
      date: startDateStr,
      tradeName: trade.name,
      entryPrice: 0,
      exitPrice: 0,
      outcome: 'TIMEOUT',
      pnlPercent: 0,
      maxDrawdown: 0,
      durationDays: 0,
      logs: ['Error: No historical data found for this date.']
    };
  }

  const entryPrice = context.point.price;
  const entryIndex = context.fullCycleData.findIndex(p => p.daysSinceHalving === context.point.daysSinceHalving);
  
  if (entryIndex === -1) return { ...context.point, date: startDateStr } as any; // Error handling shorthand

  const logs: string[] = [`Entered ${trade.type} at $${entryPrice.toFixed(2)} on ${startDateStr}`];
  let exitPrice = entryPrice;
  let outcome: 'WIN' | 'LOSS' | 'TIMEOUT' = 'TIMEOUT';
  let maxDrawdown = 0;
  let duration = 0;

  // Simulate forward
  for (let i = 1; i <= trade.exitConditions.timeHorizonDays; i++) {
    const currentIndex = entryIndex + i;
    if (currentIndex >= context.fullCycleData.length) {
      logs.push("Simulation ended: Data ran out.");
      break;
    }

    const currentPoint = context.fullCycleData[currentIndex];
    const currentPrice = currentPoint.price;
    
    // Calc PnL % from entry
    let pnl = (currentPrice - entryPrice) / entryPrice;
    if (trade.type === 'SHORT') pnl = -pnl;

    // Track Max Drawdown (lowest point relative to entry)
    if (pnl < maxDrawdown) maxDrawdown = pnl;

    // Check SL
    if (pnl <= trade.exitConditions.sl) {
      outcome = 'LOSS';
      exitPrice = currentPrice;
      duration = i;
      logs.push(`Stop Loss hit at $${currentPrice.toFixed(2)} (Day ${i})`);
      break;
    }

    // Check TP
    if (pnl >= trade.exitConditions.tp) {
      outcome = 'WIN';
      exitPrice = currentPrice;
      duration = i;
      logs.push(`Take Profit hit at $${currentPrice.toFixed(2)} (Day ${i})`);
      break;
    }

    // Check Timeout
    if (i === trade.exitConditions.timeHorizonDays) {
      exitPrice = currentPrice;
      duration = i;
      logs.push(`Time horizon reached. Closing at $${currentPrice.toFixed(2)}`);
    }
  }

  let finalPnl = (exitPrice - entryPrice) / entryPrice;
  if (trade.type === 'SHORT') finalPnl = -finalPnl;

  return {
    date: startDateStr,
    tradeName: trade.name,
    entryPrice,
    exitPrice,
    outcome,
    pnlPercent: finalPnl * 100,
    maxDrawdown: maxDrawdown * 100,
    durationDays: duration,
    logs
  };
};