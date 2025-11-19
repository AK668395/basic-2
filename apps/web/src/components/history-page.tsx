"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import { Calendar, TrendingUp } from 'lucide-react';

interface AnalysisRecord {
    id: string;
    analysis_date: string;
    description: string;
    scores: {
        overall: number;
    };
}

interface Statistics {
    total_analyses: string;
    average_score: string;
}

export function HistoryPage() {
    const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            // Handle unauthenticated state, maybe redirect to login
            return;
        }

        const fetchData = async () => {
            try {
                // In a real app, you would fetch from your API
                const mockAnalyses: AnalysisRecord[] = [
                    {
                        id: '1',
                        analysis_date: '2023-11-18T10:00:00Z',
                        description: 'Blue denim jacket, white cotton t-shirt, black slim jeans',
                        scores: { overall: 8.5 },
                    },
                    {
                        id: '2',
                        analysis_date: '2023-11-17T14:30:00Z',
                        description: 'Grey wool sweater, black chinos, leather boots',
                        scores: { overall: 9.2 },
                    },
                ];
                const mockStats: Statistics = { total_analyses: '2', average_score: '8.85' };

                setAnalyses(mockAnalyses);
                setStatistics(mockStats);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <div>Please log in to view your history.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12"
        >
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 gradient-text">
                Your Style Evolution
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Track your outfit history and see how your style has evolved over time.
            </p>

            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="glass-heavy p-6 rounded-xl text-center">
                        <Calendar size={48} className="mx-auto text-accent-gold mb-4" />
                        <p className="text-3xl font-bold text-white">{statistics.total_analyses}</p>
                        <p className="text-muted-foreground">Total Analyses</p>
                    </div>
                    <div className="glass-heavy p-6 rounded-xl text-center">
                        <TrendingUp size={48} className="mx-auto text-accent-burgundy mb-4" />
                        <p className="text-3xl font-bold text-white">{statistics.average_score}</p>
                        <p className="text-muted-foreground">Average Score</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses.map((record, index) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="glass-heavy p-6 rounded-xl floating-card"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm text-muted-foreground">
                                {new Date(record.analysis_date).toLocaleDateString()}
                            </p>
                            <div className="text-2xl font-bold text-white">
                                {record.scores.overall.toFixed(1)}
                            </div>
                        </div>
                        <p className="text-white font-medium mb-2">
                            {record.description}
                        </p>
                        <a href={`/results/${record.id}`} className="text-accent-gold hover:underline">
                            View Details
                        </a>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}