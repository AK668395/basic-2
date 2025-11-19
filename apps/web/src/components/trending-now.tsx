"use client";

import { motion } from 'framer-motion';
import { Flame, ArrowUpRight } from 'lucide-react';

const trendingItems = [
  { id: 1, name: 'Oversized Blazers', category: 'Jackets', trend: '+15%' },
  { id: 2, name: 'Cargo Pants', category: 'Trousers', trend: '+22%' },
  { id: 3, name: 'Metallic Sneakers', category: 'Shoes', trend: '+18%' },
  { id: 4, name: 'Sheer Fabrics', category: 'Tops', trend: '+12%' },
  { id: 5, name: 'Statement Belts', category: 'Accessories', trend: '+25%' },
];

export function TrendingNow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Trending Now</h2>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {trendingItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="glass-heavy p-4 rounded-lg flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-accent-gold/80 to-accent-burgundy/80 rounded-full text-white">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="font-semibold">{item.trend}</span>
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}