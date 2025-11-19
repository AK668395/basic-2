"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormType = z.infer<typeof AuthSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<AuthFormType>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: AuthFormType) => {
    setIsSubmitting(true);
    setError(null);
    console.log(`Submitting for ${mode}:`, data);

    const endpoint = mode === 'login' ? '/api/user/login' : '/api/user/register';

    try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // const response = await fetch(endpoint, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        // });

        // const result = await response.json();

        // if (!response.ok) {
        //     throw new Error(result.error?.message || 'An error occurred');
        // }

        // Handle success (e.g., redirect, save token)
        console.log('Success!');

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const title = mode === 'login' ? 'Welcome Back' : 'Create Your Account';
  const buttonText = mode === 'login' ? 'Log In' : 'Register';
  const linkText = mode === 'login' ? "Don't have an account? Register" : "Already have an account? Log in";
  const linkHref = mode === 'login' ? '/register' : '/login';

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-heavy p-8 rounded-2xl w-full max-w-sm floating-card"
    >
        <h2 className="text-3xl font-bold text-center mb-2 gradient-text">{title}</h2>
        <p className="text-muted-foreground text-center mb-6">Enter your credentials to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <input {...field} type="email" placeholder="Email" className="w-full p-3 bg-black/20 rounded-lg text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-accent-burgundy focus:outline-none transition-shadow" />
                    )}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <input {...field} type="password" placeholder="Password" className="w-full p-3 bg-black/20 rounded-lg text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-accent-burgundy focus:outline-none transition-shadow" />
                    )}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-luxury w-full p-3 bg-gradient-to-r from-accent-burgundy to-accent-gold text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <><Loader2 size={20} className="animate-spin" /><span>Processing...</span></>
                ) : (
                    <>{mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}<span>{buttonText}</span></>
                )}
            </button>
        </form>

        <div className="mt-6 text-center">
            <Link href={linkHref} className="text-sm text-muted-foreground hover:text-white transition-colors">
                {linkText}
            </Link>
        </div>
    </motion.div>
  );
}