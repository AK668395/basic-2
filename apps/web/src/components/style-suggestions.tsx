"use client";

import { StyleSuggestion } from '@shared/types/outfit';
import { motion } from 'framer-motion';
import { Lightbulb, Gem, Palette, ArrowRight } from 'lucide-react';

interface StyleSuggestionsProps {
  suggestions: StyleSuggestion[];
}

const suggestionIcons = {
  item_replacement: Gem,
  color_adjustment: Palette,
  style_enhancement: Lightbulb,
  trend_incorporation: Lightbulb,
  occasion_optimization: Lightbulb,
  accessory_addition: Gem,
};

export function StyleSuggestions({ suggestions }: StyleSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="glass-heavy p-6 rounded-2xl floating-card text-center">
        <h3 className="text-xl font-bold mb-2">No Suggestions</h3>
        <p className="text-muted-foreground">Your outfit is well-balanced! No immediate suggestions.</p>
      </div>
    );
  }

  return (
    <div className="glass-heavy p-6 rounded-2xl floating-card">
      <h3 className="text-xl font-bold mb-4">Style Suggestions</h3>
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestionIcons[suggestion.type] || Lightbulb;
          const priorityColors = {
            high: 'border-accent-burgundy/80 bg-accent-burgundy/10',
            medium: 'border-accent-gold/60 bg-accent-gold/10',
            low: 'border-accent-blue/50 bg-accent-blue/10',
          };

          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`p-4 border-l-4 rounded-r-lg ${priorityColors[suggestion.priority]}`}
            >
              <div className="flex items-start gap-4">
                <Icon size={20} className="mt-1 text-white" />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2 italic">Reasoning: {suggestion.reasoning}</p>

                  {suggestion.productSuggestions && suggestion.productSuggestions.length > 0 && (
                    <div className="mt-3">
                      <a href="#" className="text-sm font-semibold text-accent-gold hover:underline flex items-center gap-1">
                        View Product Suggestions <ArrowRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">+{suggestion.impact.scoreIncrease.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}