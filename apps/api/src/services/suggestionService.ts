import { ClothingItem, StyleSuggestion, ScoreBreakdown, Style, ProductSuggestion } from "@shared/types/outfit";

// A mock database of products for suggestions
const productDatabase: Record<string, ProductSuggestion[]> = {
    boots: [
        { id: 'prod-boot-1', name: 'Classic Leather Boot', brand: 'StyleStep', price: 150, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1599739291249-f979147d3c03?w=500', productUrl: '#', retailer: 'StyleHub', availability: 'in_stock', similarity: 0.8 }
    ],
    blazer: [
        { id: 'prod-blazer-1', name: 'Oversized Wool Blazer', brand: 'ModernFit', price: 220, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', productUrl: '#', retailer: 'FashionForward', availability: 'in_stock', similarity: 0.85 }
    ],
    accessories: [
        { id: 'prod-watch-1', name: 'Minimalist Gold Watch', brand: 'Timeless', price: 180, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', productUrl: '#', retailer: 'AccessoryHQ', availability: 'in_stock', similarity: 0.9 }
    ]
};

export async function generateSuggestions(items: ClothingItem[], scores: ScoreBreakdown, overallStyle: Style): Promise<StyleSuggestion[]> {
    console.log("Generating style suggestions...");

    const suggestions: StyleSuggestion[] = [];
    const dimensionScores = [
        { name: 'colorCoordination', score: scores.colorCoordination.score },
        { name: 'styleCompatibility', score: scores.styleCompatibility.score },
        { name: 'trendAlignment', score: scores.trendAlignment.score },
        { name: 'occasionFit', score: scores.occasionFit.score },
    ].sort((a, b) => a.score - b.score);

    // Rule 1: Address the weakest dimension first
    const weakestDimension = dimensionScores[0];
    if (weakestDimension.score < 7) {
        switch (weakestDimension.name) {
            case 'colorCoordination':
                suggestions.push({
                    id: 'sugg-color-1',
                    type: 'color_adjustment',
                    priority: 'high',
                    title: 'Refine Your Color Palette',
                    description: "A more strategic color choice could elevate this outfit. Consider creating contrast with a complementary color or harmony with an analogous one.",
                    reasoning: scores.colorCoordination.explanation,
                    impact: { scoreIncrease: 1.2, confidence: 0.85 },
                    visualExamples: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500']
                });
                break;
            case 'styleCompatibility':
                suggestions.push({
                    id: 'sugg-style-1',
                    type: 'style_enhancement',
                    priority: 'high',
                    title: 'Improve Style Cohesion',
                    description: `To better unify your look around the '${overallStyle}' style, consider replacing one of the less-matching items.`,
                    reasoning: scores.styleCompatibility.explanation,
                    impact: { scoreIncrease: 1.5, confidence: 0.88 },
                    productSuggestions: productDatabase.blazer || []
                });
                break;
            case 'trendAlignment':
                suggestions.push({
                    id: 'sugg-trend-1',
                    type: 'trend_incorporation',
                    priority: 'medium',
                    title: 'Incorporate a Current Trend',
                    description: "While your outfit is solid, adding a trending piece could make it feel more current. Consider an oversized blazer or wide-leg trousers.",
                    reasoning: scores.trendAlignment.explanation,
                    impact: { scoreIncrease: 0.8, confidence: 0.9 },
                    visualExamples: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500']
                });
                break;
            case 'occasionFit':
                 suggestions.push({
                    id: 'sugg-occasion-1',
                    type: 'occasion_optimization',
                    priority: 'high',
                    title: 'Optimize for the Occasion',
                    description: "This outfit is good, but could be perfectly tailored for the occasion. A simple swap, like shoes or a jacket, can make all the difference.",
                    reasoning: scores.occasionFit.explanation,
                    impact: { scoreIncrease: 1.0, confidence: 0.92 },
                });
                break;
        }
    }

    // Rule 2: Suggest an item replacement if there is a low-confidence item
    const lowConfidenceItem = items.find(item => item.confidence < 0.8);
    if (lowConfidenceItem && !suggestions.some(s => s.type === 'item_replacement')) {
        suggestions.push({
            id: 'sugg-replace-1',
            type: 'item_replacement',
            priority: 'medium',
            title: `Consider a Different ${lowConfidenceItem.type}`,
            description: `The ${lowConfidenceItem.type} seems to be the weakest link. Swapping it for a higher quality or better-fitting alternative would significantly boost your score.`,
            reasoning: `The AI had low confidence in this item, suggesting it may not fit the overall quality of the outfit.`,
            impact: { scoreIncrease: 0.9, confidence: 0.8 },
            productSuggestions: productDatabase.boots || []
        });
    }

    // Rule 3: Always suggest adding an accessory if possible
    if (!items.some(item => item.type === 'accessories')) {
        suggestions.push({
            id: 'sugg-accessory-1',
            type: 'accessory_addition',
            priority: 'low',
            title: 'Complete the Look with an Accessory',
            description: 'This outfit is a great canvas. Adding a statement accessory, like a watch, a necklace, or a stylish bag, can add a layer of personality and polish.',
            reasoning: 'Accessories are the finishing touch that can tie an entire outfit together and express your unique style.',
            impact: { scoreIncrease: 0.5, confidence: 0.8 },
            productSuggestions: productDatabase.accessories || []
        });
    }

    // Limit to max 3 suggestions
    return Promise.resolve(suggestions.slice(0, 3));
}