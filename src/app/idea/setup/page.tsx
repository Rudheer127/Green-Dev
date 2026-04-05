'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { BackButton } from '@/components/layout/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppState, useAppDispatch } from '@/lib/store';
import { Sparkles, Bot } from 'lucide-react';

export default function IdeaSetupPage() {
  const { projectIdea } = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [autoSuggest, setAutoSuggest] = useState(true);

  useEffect(() => {
    if (!projectIdea) router.replace('/idea');
  }, [projectIdea, router]);

  if (!projectIdea) return null;

  function handleSubmit() {
    dispatch({ type: 'SET_WANT_SUGGESTED_SETUP', payload: autoSuggest });
    router.push('/idea/scanning');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Header
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Idea', href: '/idea' },
          { label: 'Configure', href: '/idea/setup' },
        ]}
      />

      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <BackButton href="/idea" label="Back to Idea" />

        <motion.div
          className="mt-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 space-y-8" elevated>
            <div className="text-center">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mx-auto mb-4"
                style={{ background: 'var(--color-primary-tint)', color: 'var(--color-primary)' }}
              >
                <Bot className="w-3.5 h-3.5" /> AI Architect
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                Let&apos;s build your blueprint.
              </h1>
              <p className="text-sm mt-3 mx-auto max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                We can construct the most efficient, cost-effective, and sustainable tech stack tailored perfectly to your idea.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setAutoSuggest(true)}
                className="text-left p-5 rounded-[var(--radius-md)] border transition-all"
                style={{
                  background: autoSuggest ? 'var(--color-primary-tint)' : 'var(--color-surface)',
                  borderColor: autoSuggest ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                <h3 className="font-semibold text-md" style={{ color: autoSuggest ? 'var(--color-primary)' : 'var(--color-text)' }}>✨ Auto-Suggest the Best Stack</h3>
                <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-faint)' }}>We will analyze your idea and choose the greenest framework and cloud provider.</p>
              </button>
            </div>

            <div className="pt-4 flex justify-center">
              <Button size="lg" onClick={handleSubmit} className="px-10 py-6 text-lg">
                <Sparkles className="w-5 h-5 mr-2" /> 
                Generate Architecture
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
