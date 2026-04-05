'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { BackButton } from '@/components/layout/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppDispatch } from '@/lib/store';
import { Lightbulb, Sparkles } from 'lucide-react';

export default function IdeaPage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    dispatch({ type: 'SET_PROJECT_IDEA', payload: idea.trim() });
    router.push('/idea/setup');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <BackButton href="/start" label="Back to Start" />
          
          <motion.div 
            className="w-full text-center space-y-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mx-auto"
              style={{ background: 'var(--color-primary-tint)', color: 'var(--color-primary)' }}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Idea Planner
            </span>

            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              Map out your next big idea.
            </h1>

            <p className="text-base mx-auto" style={{ color: 'var(--color-text-muted)', maxWidth: '55ch' }}>
              Describe what you want to build. We&apos;ll suggest the most sustainable and efficient deployment setup for your project.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
              <Card className="p-2 focus-within:ring-2 transition-all relative" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', '--tw-ring-color': 'var(--color-primary)' } as any}>
                <textarea
                  placeholder="E.g., I want to build a real-time multiplayer chess game with user authentication and matchmaking."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={5}
                  className="w-full p-4 bg-transparent resize-none outline-none text-base"
                  style={{ color: 'var(--color-text)' }}
                />
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit" size="lg" loading={loading} disabled={!idea.trim()}>
                  <Sparkles className="w-4 h-4 mr-2" /> Plan My Setup
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
