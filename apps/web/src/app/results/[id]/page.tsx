import { AnalysisResults } from '@/components/analysis-results';
import { notFound } from 'next/navigation';

// This page will fetch the analysis results based on an ID
// For now, we'll use mock data.

async function getAnalysisData(id: string) {
    console.log('Fetching analysis data for ID:', id);
    // In a real app, you would fetch this from your API
    // const res = await fetch(`${process.env.API_URL}/analysis/${id}`);
    // if (!res.ok) return undefined;
    // return res.json();

    // Mock Data
    return {
        id: 'mock-analysis-123',
        userId: 'mock-user-456',
        input: {
            text: 'Blue denim jacket, white cotton t-shirt, black slim jeans, and white leather sneakers'
        },
        items: [
            { id: 'item-1', type: 'jacket', color: ['blue'], material: 'denim', style: 'casual', confidence: 0.9 },
            { id: 'item-2', type: 't-shirt', color: ['white'], material: 'cotton', style: 'casual', confidence: 0.95 },
            { id: 'item-3', type: 'jeans', color: ['black'], material: 'denim', style: 'casual', confidence: 0.92 },
        ],
        overallStyle: 'streetwear',
        scores: {
            overall: 8.2,
            colorCoordination: { score: 8, weight: 0.25, explanation: 'Classic and versatile color combination.' },
            styleCompatibility: { score: 8.5, weight: 0.25, explanation: 'All items fit well within a casual streetwear aesthetic.' },
            trendAlignment: { score: 7.5, weight: 0.2, explanation: 'Denim jackets and slim jeans are timeless, but not currently high-fashion.' },
            occasionFit: { score: 9, weight: 0.15, explanation: 'Excellent for a casual day out.' },
            personalStyle: { score: 8, weight: 0.15, explanation: 'Matches a classic and comfortable style profile.' },
        },
        suggestions: [
            {
                id: 'sugg-1',
                type: 'item_replacement',
                priority: 'medium',
                title: 'Elevate with Footwear',
                description: 'Consider swapping the sneakers for a pair of leather boots to add a touch of sophistication.',
                reasoning: 'Boots would elevate the overall look from casual to smart-casual, increasing versatility.',
                impact: { scoreIncrease: 0.5, confidence: 0.8 },
            },
        ],
        trends: {
            overall: { score: 7, direction: 'stable', changePercent: 0, confidence: 0.8, sampleSize: 1000, timeframe: 'week' },
            byPlatform: {
                instagram: { score: 7.5, direction: 'up', changePercent: 5, confidence: 0.85, sampleSize: 400, timeframe: 'week' },
                pinterest: { score: 7.2, direction: 'stable', changePercent: 0, confidence: 0.8, sampleSize: 300, timeframe: 'week' },
                x: { score: 6.8, direction: 'down', changePercent: -2, confidence: 0.75, sampleSize: 200, timeframe: 'week' },
                threads: { score: 7, direction: 'up', changePercent: 3, confidence: 0.8, sampleSize: 100, timeframe: 'week' },
            },
            trendingItems: [],
            seasonalTrends: [],
            demographics: { age: [], location: [], style: [] },
        },
        confidence: 0.91,
        createdAt: new Date(),
    };
}

export default async function ResultsPage({ params }: { params: { id: string } }) {
    const analysisData = await getAnalysisData(params.id);

    if (!analysisData) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-12">
            <AnalysisResults analysis={analysisData} />
        </main>
    );
}