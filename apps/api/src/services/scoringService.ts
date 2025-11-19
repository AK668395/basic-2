import { ClothingItem, ScoreBreakdown, Style, TrendData, UserPreferences } from '@shared/types/outfit';
import { getColorHarmony, getSeasonalColors } from './colorService';

const WEIGHTS = {
    colorCoordination: 0.25,
    styleCompatibility: 0.25,
    trendAlignment: 0.20,
    occasionFit: 0.15,
    personalStyle: 0.15,
};

export function calculateColorCoordination(items: ClothingItem[]): { score: number, explanation: string } {
    if (items.length < 2) {
        return { score: 7, explanation: 'A single item is neutral from a color coordination perspective.' };
    }
    const colors = items.flatMap(item => item.color);
    const harmony = getColorHarmony(colors);
    const seasonal = getSeasonalColors(new Date());

    let score = harmony.score;
    let explanation = harmony.explanation;

    const seasonalMatch = colors.some(color => seasonal.includes(color.toLowerCase()));
    if (seasonalMatch) {
        score = Math.min(10, score + 1);
        explanation += ' The color palette also aligns well with the current season.';
    }

    return { score: Math.round(score * 10) / 10, explanation };
}

export function calculateStyleCompatibility(items: ClothingItem[], overallStyle: Style): { score: number, explanation: string } {
    if (items.length < 2) {
        return { score: 8, explanation: 'A single item is inherently compatible with itself.' };
    }

    const styleCounts: Record<string, number> = {};
    items.forEach(item => {
        styleCounts[item.style] = (styleCounts[item.style] || 0) + 1;
    });

    const dominantStyle = Object.keys(styleCounts).reduce((a, b) => styleCounts[a] > styleCounts[b] ? a : b);
    const consistency = styleCounts[dominantStyle] / items.length;

    let score = 2 + (consistency * 8); // Base score of 2, max of 10
    let explanation = `The outfit shows a ${Math.round(consistency * 100)}% style consistency, centered around a ${dominantStyle} aesthetic.`;

    if (dominantStyle.toLowerCase() !== overallStyle.toLowerCase()) {
        score -= 1;
        explanation += ` However, it slightly diverges from the main perceived style of ${overallStyle}.`;
    }

    return { score: Math.max(1, Math.round(score * 10) / 10), explanation };
}

export function calculateTrendAlignment(items: ClothingItem[], trends: TrendData): { score: number, explanation: string } {
    if (!trends || !trends.trendingItems || trends.trendingItems.length === 0) {
        return { score: 6, explanation: 'Could not assess trend alignment due to lack of trend data.' };
    }

    let trendScore = 0;
    let trendMatches = 0;

    items.forEach(item => {
        if (trends.trendingItems.some(trendItem => trendItem.type === item.type && trendItem.style === item.style)) {
            trendScore += trends.overall.score;
            trendMatches++;
        }
    });

    const finalScore = trendMatches > 0 ? (trendScore / trendMatches) : 5;
    const explanation = trendMatches > 0
        ? `The outfit incorporates ${trendMatches} trending item(s), aligning with current fashion conversations.`
        : 'The outfit has a classic feel but does not strongly align with current top trends.';

    return { score: Math.round(finalScore * 10) / 10, explanation };
}

export function calculateOccasionFit(overallStyle: Style, occasion?: string): { score: number, explanation: string } {
    if (!occasion) {
        return { score: 7, explanation: 'No specific occasion was provided, assuming a general context.' };
    }

    const occasionLC = occasion.toLowerCase();
    let score = 5;
    let explanation = `For a ${occasion} occasion, a ${overallStyle} style is `;

    const styleOccasionMap: Record<Style, Record<string, number>> = {
        casual: { casual: 9, work: 4, date: 7, party: 6 },
        formal: { casual: 2, work: 9, date: 9, party: 8 },
        business: { casual: 3, work: 10, date: 7, party: 6 },
        streetwear: { casual: 10, work: 3, date: 6, party: 8 },
        athletic: { casual: 8, work: 2, date: 3, party: 4 },
        bohemian: { casual: 9, work: 5, date: 7, party: 8 },
        vintage: { casual: 8, work: 6, date: 8, party: 7 },
        minimalist: { casual: 9, work: 8, date: 8, party: 7 },
        preppy: { casual: 8, work: 7, date: 7, party: 6 },
        punk: { casual: 7, work: 2, date: 5, party: 9 },
        gothic: { casual: 6, work: 2, date: 5, party: 9 },
        romantic: { casual: 6, work: 5, date: 9, party: 8 },
        edgy: { casual: 8, work: 4, date: 7, party: 9 },
        classic: { casual: 7, work: 8, date: 8, party: 7 },
    };

    const occasionMap = styleOccasionMap[overallStyle];
    const specificOccasion = Object.keys(occasionMap).find(key => occasionLC.includes(key));

    if (specificOccasion) {
        score = occasionMap[specificOccasion];
    } else if (occasionLC.includes('casual') || occasionLC.includes('daily')) {
        score = styleOccasionMap[overallStyle].casual || 6;
    }

    if (score >= 8) explanation += 'an excellent fit.';
    else if (score >= 6) explanation += 'a good fit.';
    else if (score >= 4) explanation += 'an okay fit, but could be improved.';
    else explanation += 'not the best fit.';

    return { score, explanation };
}

export function calculatePersonalStyle(items: ClothingItem[], preferences?: UserPreferences): { score: number, explanation: string } {
    if (!preferences) {
        return { score: 7, explanation: 'Personal style preferences were not provided.' };
    }

    let score = 5;
    let matchingStyles = 0;
    let matchingColors = 0;

    items.forEach(item => {
        if (preferences.preferredStyles.includes(item.style)) {
            matchingStyles++;
        }
        if (item.color.some(c => preferences.colorPreferences.includes(c))) {
            matchingColors++;
        }
    });

    score += (matchingStyles / items.length) * 2.5;
    score += (matchingColors / items.length) * 2.5;

    const explanation = `The outfit aligns with ${Math.round((matchingStyles / items.length) * 100)}% of your preferred styles and ${Math.round((matchingColors / items.length) * 100)}% of your preferred colors.`

    return { score: Math.min(10, Math.round(score * 10) / 10), explanation };
}


export function calculateOverallScore(scores: Omit<ScoreBreakdown, 'overall'>): number {
    const weightedSum =
        scores.colorCoordination.score * WEIGHTS.colorCoordination +
        scores.styleCompatibility.score * WEIGHTS.styleCompatibility +
        scores.trendAlignment.score * WEIGHTS.trendAlignment +
        scores.occasionFit.score * WEIGHTS.occasionFit +
        scores.personalStyle.score * WEIGHTS.personalStyle;

    return Math.round(weightedSum * 10) / 10;
}