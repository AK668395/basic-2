import axios from 'axios';
import { SocialMediaPost } from '@shared/types/api';

const PINTEREST_API = 'https://api.pinterest.com/v5';

const accessToken = process.env.PINTEREST_ACCESS_TOKEN;

interface PinNode {
    id: string;
    created_at: string;
    link: string;
    note: string;
    media: { images: { '592x': { url: string } } };
    board_owner: { username: string };
    pin_metrics: Array<{ '90d': { pin_click: number, impression: number, save: number } }>;
}

export async function searchPinterestPins(query: string): Promise<SocialMediaPost[]> {
    if (!accessToken) {
        console.warn('Pinterest access token not configured.');
        return [];
    }

    try {
        const url = `${PINTEREST_API}/pins/search?query=${encodeURIComponent(query)}&limit=10`;

        // const response = await axios.get<{ items: PinNode[] }>(
        //     url,
        //     { headers: { 'Authorization': `Bearer ${accessToken}` } }
        // );

        // Mocking the response
        const mockResponse = {
            items: Array.from({ length: 4 }, (_, i) => ({
                id: `86128046391518845${i}`,
                created_at: new Date(Date.now() - i * 86400000).toISOString(),
                link: `https://www.pinterest.com/pin/86128046391518845${i}/`,
                note: `My latest obsession: ${query}! So chic and versatile. #fashioninspo`,
                media: { images: { '592x': { url: `https://images.unsplash.com/photo-1581655353419-9a4a75823164?w=500&h=700&fit=crop&q=${80+i}` } } },
                board_owner: { username: `styleguru${i}` },
                pin_metrics: [{ '90d': { pin_click: Math.floor(Math.random() * 1000), impression: Math.floor(Math.random() * 50000), save: Math.floor(Math.random() * 500) } }]
            }))
        };

        return mockResponse.items.map(pin => {
            const metrics = pin.pin_metrics[0]?.['90d'] || { pin_click: 0, impression: 0, save: 0 };
            return {
                id: pin.id,
                platform: 'pinterest',
                url: pin.link,
                imageUrl: pin.media.images['592x'].url,
                caption: pin.note,
                hashtags: [],
                mentions: [],
                engagement: {
                    likes: metrics.save, // Saves are the closest equivalent to likes
                    shares: 0, // Not directly available
                    comments: 0, // Not directly available
                    views: metrics.impression,
                },
                author: {
                    username: pin.board_owner.username,
                    displayName: pin.board_owner.username,
                    verified: false,
                    followers: 0, // Not available from this endpoint
                },
                publishedAt: pin.created_at,
                scrapedAt: new Date().toISOString(),
            };
        });

    } catch (error) {
        console.error('Error fetching Pinterest data:', error);
        return [];
    }
}
