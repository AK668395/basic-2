import { TrendData, ClothingItem } from '@shared/types/outfit';
import { SocialMediaPost } from '@shared/types/api';
import { getInstagramHashtagFeed } from './instagramService';
import { searchX } from './xService';
import { searchPinterestPins } from './pinterestService';
import { searchThreads } from './threadsService';

async function fetchAllSocialMediaData(query: string): Promise<SocialMediaPost[]> {
    const [instagram, x, pinterest, threads] = await Promise.all([
        getInstagramHashtagFeed(query),
        searchX(query),
        searchPinterestPins(query),
        searchThreads(query),
    ]);

    return [...instagram, ...x, ...pinterest, ...threads];
}

function analyzeSocialMediaPosts(posts: SocialMediaPost[]): Omit<TrendData, 'seasonalTrends' | 'demographics'> {
    if (posts.length === 0) {
        return {
            overall: { score: 5, direction: 'stable', changePercent: 0, confidence: 0.5, sampleSize: 0, timeframe: 'week' },
            byPlatform: {
                instagram: { score: 5, direction: 'stable', changePercent: 0, confidence: 0.5, sampleSize: 0, timeframe: 'week' },
                pinterest: { score: 5, direction: 'stable', changePercent: 0, confidence: 0.5, sampleSize: 0, timeframe: 'week' },
                x: { score: 5, direction: 'stable', changePercent: 0, confidence: 0.5, sampleSize: 0, timeframe: 'week' },
                threads: { score: 5, direction: 'stable', changePercent: 0, confidence: 0.5, sampleSize: 0, timeframe: 'week' },
            },
            trendingItems: [],
        };
    }

    const platformData: Record<string, SocialMediaPost[]> = {
        instagram: [],
        pinterest: [],
        x: [],
        threads: [],
    };

    posts.forEach(post => {
        if (platformData[post.platform]) {
            platformData[post.platform].push(post);
        }
    });

    const getPlatformMetrics = (platformPosts: SocialMediaPost[]) => {
        if (platformPosts.length === 0) return { score: 5, direction: 'stable', changePercent: 0, sampleSize: 0 };
        const avgLikes = platformPosts.reduce((sum, p) => sum + p.engagement.likes, 0) / platformPosts.length;
        const score = Math.min(10, 5 + Math.log1p(avgLikes / 100));
        return {
            score,
            direction: 'up', // Mocked
            changePercent: Math.random() * 10, // Mocked
            sampleSize: platformPosts.length,
        };
    };

    const byPlatform = {
        instagram: { ...getPlatformMetrics(platformData.instagram), confidence: 0.9, timeframe: 'week' },
        pinterest: { ...getPlatformMetrics(platformData.pinterest), confidence: 0.85, timeframe: 'week' },
        x: { ...getPlatformMetrics(platformData.x), confidence: 0.8, timeframe: 'week' },
        threads: { ...getPlatformMetrics(platformData.threads), confidence: 0.82, timeframe: 'week' },
    };

    const overallScore = Object.values(byPlatform).reduce((sum, p) => sum + p.score, 0) / 4;

    // Crude trending item detection
    const hashtagCounts: Record<string, number> = {};
    posts.forEach(post => {
        post.hashtags.forEach(tag => {
            hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
    });
    const trendingTags = Object.entries(hashtagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    return {
        overall: { score: overallScore, direction: 'up', changePercent: 5, confidence: 0.88, sampleSize: posts.length, timeframe: 'week' },
        byPlatform,
        trendingItems: trendingTags.map(tag => ({ id: tag, type: 'accessories', style: 'streetwear', color: [], material: 'cotton', confidence: 0.7 }))
    };
}


export async function getTrendData(items: ClothingItem[]): Promise<TrendData> {
    console.log("Fetching and analyzing trend data (MOCKED)");

    const primaryQuery = items.map(item => `${item.color[0] || ''} ${item.type}`).join(' ');
    const socialData = await fetchAllSocialMediaData(primaryQuery || 'fashion');
    const analysis = analyzeSocialMediaPosts(socialData);

    return {
        ...analysis,
        seasonalTrends: [
            { season: 'fall', trends: ['earth tones', 'layering', 'boots'], popularity: 0.85, yearOverYearChange: 5 }
        ],
        demographics: {
            age: ['18-25', '26-35'],
            location: ['urban'],
            style: ['streetwear', 'minimalist']
        }
    };

}