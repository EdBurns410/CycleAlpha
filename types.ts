export enum CyclePhase {
  EARLY_BULL = 'Early Bull',
  MID_BULL = 'Mid Bull',
  LATE_BULL = 'Late Bull (Mania)',
  BEAR_MARKET = 'Bear Market',
  ACCUMULATION = 'Accumulation'
}

export enum NarrativeRegime {
  LIQUIDITY_EXPANSION = 'Liquidity Expansion',
  LIQUIDITY_TIGHTENING = 'Liquidity Tightening',
  REGULATORY_HEADWIND = 'Regulatory Headwind',
  INSTITUTIONAL_ADOPTION = 'Institutional Adoption',
  TECH_BREAKTHROUGH = 'Tech Breakthrough',
  SPECULATIVE_MANIA = 'Speculative Mania',
  FEAR_UNCERTAINTY = 'Fear & Uncertainty'
}

export interface CyclePoint {
  daysSinceHalving: number;
  priceMultiplier: number; // 1.0 = price at halving
  cycleId: string;
  date: string;
  price: number;
}

export interface TradeTemplate {
  id: string;
  name: string;
  description: string;
  type: 'LONG' | 'SHORT' | 'ROTATION' | 'HEDGE';
  riskLevel: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  entryConditions: string[];
  exitConditions: {
    tp: number; // percentage, e.g., 0.15 for 15%
    sl: number; // percentage, e.g., -0.05 for -5%
    timeHorizonDays: number;
  };
}

export interface AnalysisResult {
  cyclePhase: CyclePhase;
  daysSinceHalving: number;
  priceDeviationFromMedian: number; // percentage
  narrativeRegime: NarrativeRegime;
  summary: string;
  recommendedTemplates: TradeTemplate[];
}

export interface SimulationResult {
  date: string;
  tradeName: string;
  entryPrice: number;
  exitPrice: number;
  outcome: 'WIN' | 'LOSS' | 'TIMEOUT';
  pnlPercent: number;
  maxDrawdown: number;
  durationDays: number;
  logs: string[];
}

export interface NewsItem {
  id: string;
  headline: string;
  date: string;
  source: string;
}