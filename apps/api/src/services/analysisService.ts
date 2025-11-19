import { OutfitInput, OutfitAnalysis, ClothingItem } from '@shared/types/outfit';
import { callOpenAIVision } from './aiService';
import * as scoring from './scoringService';
import { getTrendData } from './trendService';
import { generateSuggestions } from './suggestionService';

interface AnalysisInput {
  text?: string;
  occasion?: string;
  image?: Buffer;
  userId?: string; // To be used for personal style scoring
}

export const analyzeOutfit = async (input: AnalysisInput): Promise<OutfitAnalysis> => {
  console.log('Analyzing outfit with input:', { ...input, image: '...buffer...' });

  // 1. Get initial analysis from AI Vision
  const visionAnalysis = await callOpenAIVision(input.text, input.image);

  // 2. Fetch trend data
  const trendData = await getTrendData(visionAnalysis.items);

  // 3. Calculate scores for each dimension
  const colorScore = scoring.calculateColorCoordination(visionAnalysis.items);
  const styleScore = scoring.calculateStyleCompatibility(visionAnalysis.items, visionAnalysis.overallStyle);
  const trendScore = scoring.calculateTrendAlignment(visionAnalysis.items, trendData);
  const occasionScore = scoring.calculateOccasionFit(visionAnalysis.overallStyle, input.occasion);
  // Personal style score will be a placeholder until user preferences are implemented
  const personalStyleScore = scoring.calculatePersonalStyle(visionAnalysis.items, undefined);

  const scores = {
      colorCoordination: { ...colorScore, weight: 0.25 },
      styleCompatibility: { ...styleScore, weight: 0.25 },
      trendAlignment: { ...trendScore, weight: 0.20 },
      occasionFit: { ...occasionScore, weight: 0.15 },
      personalStyle: { ...personalStyleScore, weight: 0.15 },
  };

  // 4. Calculate overall score
  const overallScore = scoring.calculateOverallScore(scores);

  // 5. Generate suggestions
  const suggestions = await generateSuggestions(visionAnalysis.items, { ...scores, overall: overallScore }, visionAnalysis.overallStyle);

  const analysisResult: OutfitAnalysis = {
    id: `analysis-${new Date().getTime()}`,
    userId: input.userId || 'guest',
    input: {
      text: input.text,
      occasion: input.occasion,
    },
    items: visionAnalysis.items,
    overallStyle: visionAnalysis.overallStyle,
    scores: {
        ...scores,
        overall: overallScore,
    },
    suggestions,
    trends: trendData,
    confidence: visionAnalysis.confidence, // This should probably be re-calculated based on all factors
    createdAt: new Date(),
  };

  return analysisResult;
};