import axios from 'axios';
import { SocialMediaPost } from '@shared/types/api';

const INSTAGRAM_GRAPH_API = 'https://graph.facebook.com/v19.0';

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

interface HashtagSearchResponse {
    data: Array<{ id: string }>;
}

interface MediaNode {
    id: string;
    media_url: string;
    caption: string;
    like_count: number;
    comments_count: number;
    timestamp: string;
    permalink: string;
}

export async function getInstagramHashtagFeed(hashtag: string): Promise<SocialMediaPost[]> {
    if (!accessToken) {
        console.warn('Instagram access token not configured.');
        return [];
    }

    try {
        // This is a simplified flow. A real implementation would require a business account ID,
        // and the permissions would be more complex.
        const searchUrl = `${INSTAGRAM_GRAPH_API}/ig_hashtag_search?user_id=me&q=${hashtag}&access_token=${accessToken}`;
        // const searchResponse = await axios.get<HashtagSearchResponse>(searchUrl);
        // const hashtagId = searchResponse.data.data[0]?.id;

        // Mocking the response as the API requires a business account and app review.
        const hashtagId = '17841562498105353'; // Mock for #fashion

        if (!hashtagId) {
            return [];
        }

        const mediaUrl = `${INSTAGRAM_GRAPH_API}/${hashtagId}/top_media?user_id=me&fields=id,media_url,caption,like_count,comments_count,timestamp,permalink&limit=10&access_token=${accessToken}`;
        // const mediaResponse = await axios.get<{ data: MediaNode[] }>(mediaUrl);

        // Mocking the media response
        const mockMediaResponse = {
            data: Array.from({ length: 5 }, (_, i) => ({
                id: `17895695668004550${i}`,
                media_url: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=700&fit=crop&q=${80+i}`,
                caption: `Loving this new fall look! #${hashtag} #OOTD`,
                like_count: Math.floor(Math.random() * 5000) + 1000,
                comments_count: Math.floor(Math.random() * 200) + 50,
                timestamp: new Date(Date.now() - i * 3600000).toISOString(),
                permalink: 'https://www.instagram.com/p/Cxyz123abc/',
            }))
        }

        return mockMediaResponse.data.map(post => ({
            id: post.id,
            platform: 'instagram',
            url: post.permalink,
            imageUrl: post.media_url,
            caption: post.caption,
            hashtags: [hashtag],
            mentions: [],
            engagement: {
                likes: post.like_count,
                shares: 0, // Not available from this endpoint
                comments: post.comments_count,
            },
            author: {
                username: 'mockuser',
                displayName: 'Mock User',
                verified: false,
                followers: 1000
            },
            publishedAt: post.timestamp,
            scrapedAt: new Date().toISOString(),
        }));

    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        return [];
    }
}
