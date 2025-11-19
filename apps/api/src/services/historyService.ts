import { query, getClient } from '@database/db';
import { OutfitAnalysis } from '@shared/types/outfit';

export const saveAnalysisToHistory = async (userId: string, analysis: Omit<OutfitAnalysis, 'id' | 'createdAt' | 'userId'>) => {
    const client = await getClient();
    try {
        await client.query('BEGIN');

        // 1. Create an entry in the 'outfits' table
        const outfitResult = await client.query(
            'INSERT INTO outfits (user_id, description, image_url) VALUES ($1, $2, $3) RETURNING id',
            [userId, analysis.input.text, ''] // Assuming image_url is not yet available from analysis
        );
        const outfitId = outfitResult.rows[0].id;

        // 2. Create an entry in the 'analyses' table linked to the outfit
        const analysisResult = await client.query(
            'INSERT INTO analyses (outfit_id, user_id, scores, suggestions, trends, confidence) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [outfitId, userId, JSON.stringify(analysis.scores), JSON.stringify(analysis.suggestions), JSON.stringify(analysis.trends), analysis.confidence]
        );
        const analysisId = analysisResult.rows[0].id;

        await client.query('COMMIT');

        return { outfitId, analysisId };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving analysis to history:', error);
        throw error;
    } finally {
        client.release();
    }
};

export const getUserAnalysisHistory = async (userId: string, page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;

    const result = await query(
        `SELECT
            a.*,
            o.description,
            o.image_url,
            a.created_at as analysis_date
        FROM analyses a
        JOIN outfits o ON a.outfit_id = o.id
        WHERE a.user_id = $1
        ORDER BY a.created_at DESC
        LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    return result.rows;
};

export const getUserAnalysisStatistics = async (userId: string) => {
    const result = await query(
        `SELECT
            COUNT(*) as total_analyses,
            AVG((scores->>'overall')::numeric) as average_score
        FROM analyses
        WHERE user_id = $1`,
        [userId]
    );

    return result.rows[0];
};