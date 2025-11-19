"use client";

import { motion } from 'framer-motion';

const mockAnalyses = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=700&fit=crop',
    score: 8.2,
    title: 'Casual Streetwear',
    date: '2 days ago',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1581655353419-9a4a75823164?w=500&h=700&fit=crop',
    score: 9.1,
    title: 'Elegant Evening Look',
    date: 'Yesterday',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=700&fit=crop',
    score: 7.5,
    title: 'Business Casual',
    date: 'A week ago',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1591047139829-d916bb69a6cf?w=500&h=700&fit=crop',
    score: 8.8,
    title: 'Winter Layers',
    date: '3 hours ago',
  },
];

export function RecentAnalyses() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Recent Analyses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mockAnalyses.map((analysis, index) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="group relative overflow-hidden rounded-xl glass-heavy floating-card"
          >
            <img
              src={analysis.image}
              alt={analysis.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-semibold text-white text-lg">{analysis.title}</h3>
                  <p className="text-sm text-muted-foreground">{analysis.date}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-burgundy/80 border-2 border-white/50 text-white font-bold text-xl">
                  {analysis.score}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}