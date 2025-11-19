"use client";

import { OutfitAnalysis } from '@shared/types/outfit';
import { motion } from 'framer-motion';
import { ScoreBreakdown } from './score-breakdown';
import { StyleSuggestions } from './style-suggestions';
import { TrendDisplay } from './trend-display';
import { OverallScore } from './overall-score';

interface AnalysisResultsProps {
  analysis: OutfitAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Your Style Analysis is Ready</h1>
        <p className="text-lg text-muted-foreground">Here's the breakdown of your outfit score and suggestions.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column for score */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
          <OverallScore score={analysis.scores.overall} />
          <ScoreBreakdown scores={analysis.scores} />
        </motion.div>

        {/* Right column for suggestions and trends */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <StyleSuggestions suggestions={analysis.suggestions} />
          <TrendDisplay trends={analysis.trends} />
        </motion.div>
      </div>
    </motion.div>
  );
}