"use client";

import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface OverallScoreProps {
  score: number;
}

export function OverallScore({ score }: OverallScoreProps) {
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass-heavy p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center floating-card"
    >
      <div
        className="relative w-48 h-48 rounded-full flex items-center justify-center"
        style={{ background: `radial-gradient(circle, ${scoreColor}33, transparent 70%)` }}
      >
        <motion.div
          initial={{ strokeDashoffset: 1000 }}
          animate={{ strokeDashoffset: 1000 - (score / 10) * 1000 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring' }}
          className="absolute inset-0"
        >
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="stroke-current text-white/10"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="stroke-current transition-colors duration-500"
              strokeWidth="2"
              strokeDasharray="100, 100"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: scoreColor, strokeDasharray: `${score * 10}, 100` }}
            />
          </svg>
        </motion.div>
        <div className="text-6xl font-bold score-count" style={{ color: scoreColor }}>
          {score.toFixed(1)}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white">{scoreLabel}</h2>
      <p className="text-muted-foreground max-w-xs">
        Your outfit score is based on a detailed analysis of color, style, trends, and more.
      </p>
    </motion.div>
  );
}