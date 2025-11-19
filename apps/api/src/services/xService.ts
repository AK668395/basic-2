import axios from 'axios';
import { SocialMediaPost } from '@shared/types/api';

const X_API_V2 = 'https://api.twitter.com/2';

const bearerToken = process.env.X_BEARER_TOKEN;

interface TweetNode {
    id: string;
    text: string;
    created_at: string;
    public_metrics: {
        retweet_count: number;
        reply_count: number;
        like_count: number;
        quote_count: number;
        impression_count: number;
    };
    author_id: string;
    entities?: {
        hashtags?: Array<{ start: number, end: number, tag: string }>;
        mentions?: Array<{ start: number, end: number, username: string }>;
        urls?: Array<{ start: number, end: number, url: string, expanded_url: string, display_url: string }>;
    };
}

interface UserNode {
    id: string;
    name: string;
    username: string;
    verified: boolean;
    public_metrics: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
        listed_count: number;
    };
}


export async function searchX(query: string): Promise<SocialMediaPost[]> {
    if (!bearerToken) {
        console.warn('X API bearer token not configured.');
        return [];
    }

    try {
        const url = `${X_API_V2}/tweets/search/recent?query=${encodeURIComponent(query)}&tweet.fields=created_at,public_metrics,entities&expansions=author_id&user.fields=public_metrics,verified&max_results=10`;

        // const response = await axios.get<{ data: TweetNode[], includes: { users: UserNode[] } }>(
        //     url,
        //     { headers: { 'Authorization': `Bearer ${bearerToken}` } }
        // );

        // Mocking the response
        const mockResponse = {
            data: Array.from({ length: 3 }, (_, i) => ({
                id: `1460323737035678722${i}`,
                text: `Just saw the most amazing street style today! ${query}`,
                created_at: new Date(Date.now() - i * 1800000).toISOString(),
                public_metrics: {
                    retweet_count: Math.floor(Math.random() * 50),
                    reply_count: Math.floor(Math.random() * 20),
                    like_count: Math.floor(Math.random() * 200),
                    quote_count: Math.floor(Math.random() * 10),
                    impression_count: Math.floor(Math.random() * 10000),
                },
                author_id: `2244994945${i}`,
                entities: { hashtags: [{ tag: 'fashiontrends' }] }
            })),
            includes: {
                users: Array.from({ length: 3 }, (_, i) => ({
                    id: `2244994945${i}`,
                    name: `Fashionista ${i+1}`,
                    username: `fashionlover${i+1}`,
                    verified: i % 2 === 0,
                    public_metrics: { followers_count: Math.floor(Math.random() * 10000) },
                }))
            }
        };

        const usersMap = new Map(mockResponse.includes.users.map(user => [user.id, user]));

        return mockResponse.data.map(tweet => {
            const author = usersMap.get(tweet.author_id)!;
            return {
                id: tweet.id,
                platform: 'x',
                url: `https://twitter.com/${author.username}/status/${tweet.id}`,
                caption: tweet.text,
                hashtags: tweet.entities?.hashtags?.map(h => h.tag) || [],
                mentions: tweet.entities?.mentions?.map(m => m.username) || [],
                engagement: {
                    likes: tweet.public_metrics.like_count,
                    shares: tweet.public_metrics.retweet_count,
                    comments: tweet.public_metrics.reply_count,
                    views: tweet.public_metrics.impression_count,
                },
                author: {
                    username: author.username,
                    displayName: author.name,
                    verified: author.verified,
                    followers: author.public_metrics.followers_count,
                },
                publishedAt: tweet.created_at,
                scrapedAt: new Date().toISOString(),
            };
        });

    } catch (error) {
        console.error('Error fetching X data:', error);
        return [];
    }
}
