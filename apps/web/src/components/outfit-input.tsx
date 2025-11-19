"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Text, Image, Wand2, Loader2, UploadCloud, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { cn } from '@/lib/utils';

const OutfitInputSchema = z.object({
  text: z.string().optional(),
  image: z.any().optional(),
  occasion: z.string().optional(),
});

type OutfitInputForm = z.infer<typeof OutfitInputSchema>;

export function OutfitInput() {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, setValue, watch } = useForm<OutfitInputForm>({
    resolver: zodResolver(OutfitInputSchema),
  });

  const imageFile = watch('image');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setValue('image', null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: OutfitInputForm) => {
    setIsSubmitting(true);
    console.log('Submitting:', data);
    // TODO: Add actual API call to backend
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  const buttonClasses = (isActive: boolean) =>
    cn(
      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
      isActive
        ? 'bg-white/10 text-white'
        : 'bg-transparent text-muted-foreground hover:bg-white/5'
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-heavy p-6 rounded-2xl floating-card"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center mb-6">
          <div className="glass p-1 rounded-full flex items-center space-x-1">
            <button type="button" onClick={() => setMode('text')} className={buttonClasses(mode === 'text')}>
              <Text size={16} />
              <span>Describe Outfit</span>
            </button>
            <button type="button" onClick={() => setMode('image')} className={buttonClasses(mode === 'image')}>
              <Image size={16} />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'text' ? (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Controller
                name="text"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="e.g., Blue denim jacket, white cotton t-shirt, black slim jeans, and white leather sneakers..."
                    className="w-full h-32 p-4 bg-black/20 rounded-lg text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-accent-burgundy focus:outline-none transition-shadow"
                  />
                )}
              />
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="relative w-full h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground cursor-pointer hover:border-accent-burgundy transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Outfit preview" className="object-cover w-full h-full rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleImageRemove(); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <UploadCloud size={32} className="mx-auto mb-2" />
                    <p>Click to upload a photo</p>
                    <p className="text-xs">PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <Controller
            name="occasion"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Occasion (e.g., Casual, Work, Date Night)"
                className="w-full sm:w-1/2 p-3 bg-black/20 rounded-full text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-accent-burgundy focus:outline-none transition-shadow"
              />
            )}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-luxury w-full sm:w-1/2 p-3 bg-gradient-to-r from-accent-burgundy to-accent-gold text-white font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>Analyze Outfit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}