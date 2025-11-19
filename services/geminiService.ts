import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CyclePhase, NarrativeRegime, TradeTemplate } from '../types';

const API_KEY = process.env.API_KEY || '';

// Mock result fallback if API key is missing
const MOCK_ANALYSIS: AnalysisResult = {
  cyclePhase: CyclePhase.MID_BULL,
  daysSinceHalving: 150,
  priceDeviationFromMedian: 12.5,
  narrativeRegime: NarrativeRegime.INSTITUTIONAL_ADOPTION,
  summary: "Historical patterns suggest we are in the early expansion phase. The news indicates strong institutional interest (ETFs) countering macro headwinds.",
  recommendedTemplates: [
    {
      id: 'trend-follow-btc',
      name: 'BTC Trend Continuation',
      description: 'Long BTC with trailing stop to capture mid-cycle expansion.',
      type: 'LONG',
      riskLevel: 'MODERATE',
      entryConditions: ['Price > 200D MA', 'Regime != Liquidity Tightening'],
      exitConditions: { tp: 0.25, sl: -0.10, timeHorizonDays: 60 }
    },
    {
      id: 'long-vol-hedge',
      name: 'Defensive Posture',
      description: 'Reduce exposure, hold spot + stables.',
      type: 'HEDGE',
      riskLevel: 'CONSERVATIVE',
      entryConditions: ['Vix > 30', 'Regime == Fear'],
      exitConditions: { tp: 0, sl: 0, timeHorizonDays: 14 }
    }
  ]
};

export const analyzeContextWithGemini = async (
  newsText: string, 
  cycleData: string
): Promise<AnalysisResult> => {
  if (!API_KEY) {
    console.warn("No API Key provided. Returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ANALYSIS), 1500));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
      Act as a senior crypto quantitative researcher.
      
      Context Data:
      ${cycleData}
      
      News/Headlines:
      ${newsText}
      
      Task:
      1. Analyze the news sentiment and assign a Narrative Regime.
      2. based on the cycle data provided (days since halving, price action), determine the Cycle Phase.
      3. Suggest 2 structured trade templates that fit this specific historical context.
      
      Return JSON only using the schema provided.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cyclePhase: { type: Type.STRING, enum: Object.values(CyclePhase) },
            daysSinceHalving: { type: Type.NUMBER },
            priceDeviationFromMedian: { type: Type.NUMBER },
            narrativeRegime: { type: Type.STRING, enum: Object.values(NarrativeRegime) },
            summary: { type: Type.STRING },
            recommendedTemplates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['LONG', 'SHORT', 'ROTATION', 'HEDGE'] },
                  riskLevel: { type: Type.STRING, enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] },
                  entryConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  exitConditions: {
                    type: Type.OBJECT,
                    properties: {
                      tp: { type: Type.NUMBER },
                      sl: { type: Type.NUMBER },
                      timeHorizonDays: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_ANALYSIS;
  }
};