"use client";

import { ScoreBreakdown as ScoreBreakdownType } from '@shared/types/outfit';
import { motion } from 'framer-motion';
import { Palette, Gem, ShoppingBag, Clapperboard, User } from 'lucide-react';
import { getScoreColor } from '@/lib/utils';

interface ScoreBreakdownProps {
  scores: ScoreBreakdownType;
}

const dimensionDetails = {
  colorCoordination: { label: 'Color Coordination', icon: Palette },
  styleCompatibility: { label: 'Style Compatibility', icon: Gem },
  trendAlignment: { label: 'Trend Alignment', icon: ShoppingBag },
  occasionFit: { label: 'Occasion Fit', icon: Clapperboard },
  personalStyle: { label: 'Personal Style', icon: User },
};

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const dimensions = Object.entries(scores)
    .filter(([key]) => key !== 'overall')
    .map(([key, value]) => ({ ...value, key }));

  return (
    <div className="glass-heavy p-6 rounded-2xl floating-card">
      <h3 className="text-xl font-bold mb-4">Score Breakdown</h3>
      <div className="space-y-4">
        {dimensions.map((dim, index) => {
          const detail = dimensionDetails[dim.key as keyof typeof dimensionDetails];
          if (!detail) return null;

          const scoreColor = getScoreColor(dim.score);

          return (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex items-center gap-3 mb-1">
                <detail.icon size={16} className="text-muted-foreground" />
                <span className="font-semibold text-sm text-white">{detail.label}</span>
                <span className="ml-auto font-bold text-sm" style={{ color: scoreColor }}>
                  {dim.score.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1.5">
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ background: scoreColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score * 10}%` }}
                  transition={{ duration: 0.8, delay: 0.2 * index, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{dim.explanation}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}