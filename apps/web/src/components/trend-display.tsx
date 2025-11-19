"use client";

import { TrendData } from '@shared/types/outfit';
import { motion } from 'framer-motion';
import { Flame, Instagram, Twitter } from 'lucide-react';

// Assuming Pinterest and Threads icons are not in lucide-react, using placeholders
const PinterestIcon = () => <svg>...</svg>;
const ThreadsIcon = () => <svg>...</svg>;

interface TrendDisplayProps {
  trends: TrendData;
}

const platformDetails = {
  instagram: { icon: Instagram, name: 'Instagram' },
  pinterest: { icon: PinterestIcon, name: 'Pinterest' },
  x: { icon: Twitter, name: 'X (Twitter)' },
  threads: { icon: ThreadsIcon, name: 'Threads' },
};

export function TrendDisplay({ trends }: TrendDisplayProps) {
  const platforms = Object.entries(trends.byPlatform);

  return (
    <div className="glass-heavy p-6 rounded-2xl floating-card">
      <h3 className="text-xl font-bold mb-4">Trend Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Trend Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-black/20 p-4 rounded-lg flex items-center gap-4"
        >
          <div className="p-3 bg-gradient-to-br from-accent-gold to-accent-burgundy rounded-full text-white">
            <Flame size={24} />
          </div>
          <div>
            <p className="font-semibold text-white text-lg">Overall Trend Score</p>
            <p className="text-3xl font-bold gradient-text">{trends.overall.score.toFixed(1)}</p>
          </div>
        </motion.div>

        {/* Platform breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {platforms.map(([key, value], index) => {
            const detail = platformDetails[key as keyof typeof platformDetails];
            if (!detail) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-black/20 p-3 rounded-lg text-center"
              >
                <detail.icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="font-bold text-lg text-white">{value.score.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">{detail.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trending Items */}
      {trends.trendingItems && trends.trendingItems.length > 0 && (
        <div className="mt-6">
            <h4 className="font-semibold mb-2">Hot Right Now</h4>
            <div className="flex flex-wrap gap-2">
                {trends.trendingItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full"
                    >
                        {item.id}
                    </motion.div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}