"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Camera,
      title: 'Photo Analysis',
      description: 'Upload your outfit photo for instant AI analysis',
    },
    {
      icon: Sparkles,
      title: 'Smart Scoring',
      description: 'Get detailed 1-10 ratings across multiple style dimensions',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Trends',
      description: 'Analysis powered by Instagram, Pinterest, X, and Threads data',
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-accent-burgundy/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-accent-blue/20 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="gradient-text">StyleSage AI</span>
            </h1>
            <p className="text-xl md:text-2xl mt-6 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your style with AI-powered outfit analysis.
              Get personalized ratings and suggestions based on real-time fashion trends.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <div className="text-sm text-muted-foreground">
              Start analyzing below — no account required
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group"
              >
                <div
                  className={cn(
                    'glass-heavy p-6 rounded-xl transition-all duration-300 cursor-pointer',
                    'hover:transform hover:-translate-y-2 hover:shadow-2xl',
                    hoveredFeature === index && 'ring-2 ring-accent-burgundy/50'
                  )}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-accent-burgundy to-accent-gold text-white">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 glass-light rounded-xl p-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-8 text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm">Outfits Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.8★</div>
                <div className="text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Real-time</div>
                <div className="text-sm">Fashion Data</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}