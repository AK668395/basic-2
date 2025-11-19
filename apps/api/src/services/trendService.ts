import { TrendData, ClothingItem } from "@shared/types/outfit";

export async function getTrendData(items: ClothingItem[]): Promise<TrendData> {
    console.log("Fetching trend data (MOCKED)");

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                overall: { score: 7.2, direction: 'up', changePercent: 3, confidence: 0.88, sampleSize: 1500, timeframe: 'week' },
                byPlatform: {
                    instagram: { score: 7.8, direction: 'up', changePercent: 6, confidence: 0.9, sampleSize: 500, timeframe: 'week' },
                    pinterest: { score: 7.5, direction: 'stable', changePercent: 1, confidence: 0.85, sampleSize: 400, timeframe: 'week' },
                    x: { score: 6.5, direction: 'down', changePercent: -2, confidence: 0.8, sampleSize: 300, timeframe: 'week' },
                    threads: { score: 6.9, direction: 'up', changePercent: 4, confidence: 0.82, sampleSize: 300, timeframe: 'week' },
                },
                trendingItems: [
                    { id: 'trend-1', type: 'jacket', color: ['any'], material: 'leather', style: 'streetwear', confidence: 0.8 },
                    { id: 'trend-2', type: 'jeans', color: ['light wash'], material: 'denim', style: 'vintage', confidence: 0.75 },
                ],
                seasonalTrends: [
                    { season: 'fall', trends: ['earth tones', 'layering', 'boots'], popularity: 0.85, yearOverYearChange: 5 }
                ],
                demographics: {
                    age: ['18-25', '26-35'],
                    location: ['urban'],
                    style: ['streetwear', 'minimalist']
                }
            });
        }, 500);
    });
}