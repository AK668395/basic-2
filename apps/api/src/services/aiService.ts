import { OpenAI } from 'openai';
import { ClothingItem, Style } from '@shared/types/outfit';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface VisionAnalysis {
    items: ClothingItem[];
    overallStyle: Style;
    confidence: number;
}

export async function callOpenAIVision(text?: string, imageBuffer?: Buffer): Promise<VisionAnalysis> {
    if (!text && !imageBuffer) {
        throw new Error('Either text or image must be provided for analysis.');
    }

    const messages: any[] = [
        {
            role: 'system',
            content: `You are a fashion expert AI. Analyze the provided outfit description or image and identify all clothing items. For each item, provide its type, color(s), material, and style. Also determine the overall style of the outfit. Respond ONLY with a JSON object matching the following structure: { "items": ClothingItem[], "overallStyle": Style, "confidence": number }. Do not include any other text or explanation. The ClothingItem type must be one of ['t-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'jacket', 'coat', 'blazer', 'jeans', 'trousers', 'shorts', 'skirt', 'dress', 'sneakers', 'boots', 'heels', 'sandals', 'accessories']. The Style type must be one of ['casual', 'formal', 'business', 'streetwear', 'athletic', 'bohemian', 'vintage', 'minimalist', 'preppy', 'punk', 'gothic', 'romantic', 'edgy', 'classic'].`
        },
        {
            role: 'user',
            content: []
        }
    ];

    if (text) {
        messages[1].content.push({ type: 'text', text: `Analyze this outfit: ${text}` });
    }

    if (imageBuffer) {
        const base64Image = imageBuffer.toString('base64');
        messages[1].content.push({
            type: 'image_url',
            image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
            }
        });
    }

    // Mocking the OpenAI call for now
    console.log("Making a call to OpenAI Vision API (MOCKED)");

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                items: [
                  { id: 'item-1-ai', type: 'jacket', color: ['blue'], material: 'denim', style: 'casual', confidence: 0.9 },
                  { id: 'item-2-ai', type: 't-shirt', color: ['white'], material: 'cotton', style: 'casual', confidence: 0.95 },
                  { id: 'item-3-ai', type: 'jeans', color: ['black'], material: 'denim', style: 'casual', confidence: 0.92 },
                ],
                overallStyle: 'streetwear',
                confidence: 0.94
            });
        }, 1000);
    });
}