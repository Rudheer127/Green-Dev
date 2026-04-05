'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAppState, useAppDispatch } from '@/lib/store';
import { cn } from '@/lib/utils';

const STEPS = [
  'Understanding your project idea',
  'Evaluating framework alternatives',
  'Designing architecture blueprint',
  'Scoring sustainability footprint',
  'Generating final blueprint',
];

const FUN_FACTS = [
  '☁️ Selecting a green cloud provider cuts emissions by up to 80%.',
  '🌿 Defaulting to serverless scales right down to zero when idle.',
  '⚡ Shipping zero JS by default (like Astro) saves battery and bandwidth.',
  '📦 Using managed edge networks reduces global latency and server load.',
];

export default function IdeaScanningPage() {
  const { projectIdea, wantSuggestedSetup } = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [factIndex, setFactIndex] = useState(0);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!projectIdea) {
      router.replace('/idea');
    }
  }, [projectIdea, router]);

  // Step animation
  useEffect(() => {
    if (doneRef.current) return;
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < 4; i++) {
      timers.push(setTimeout(() => { if (!doneRef.current) setActiveStep(i + 1); }, (i + 1) * 2000));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 3) return 3; // Pause at 3
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotating facts
  useEffect(() => {
    const interval = setInterval(() => setFactIndex((i) => (i + 1) % FUN_FACTS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  // API call
  useEffect(() => {
    if (!projectIdea) return;
    const controller = new AbortController();
    abortRef.current = controller;

    async function runAnalysis() {
      const startTime = Date.now();
      try {
        const res = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectIdea, wantSuggestedSetup }),
          signal: controller.signal,
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setError(json?.error || `Planning failed (${res.status}). Please try again.`);
          return;
        }

        if (json && json.success && json.data) {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 3000 - elapsed);
          
          await new Promise(r => setTimeout(r, remaining));
          
          doneRef.current = true;
          setActiveStep(STEPS.length);
          dispatch({ type: 'SET_PLAN_RESULT', payload: json.data });
          await new Promise((r) => setTimeout(r, 800));
          router.push('/results'); // Reuse results view
        } else {
          setError(json?.error || 'Planning failed. Unknown error occurred.');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Network or server error. Please try again.');
        }
      }
    }

    runAnalysis();
    return () => controller.abort();
  }, [projectIdea, wantSuggestedSetup, dispatch, router]);

  function handleRetry() {
    setError('');
    setActiveStep(0);
    setCountdown(15);
    doneRef.current = false;
    router.replace('/idea/scanning');
  }

  function handleCancel() {
    abortRef.current?.abort();
    dispatch({ type: 'RESET_ALL' });
    router.push('/');
  }

  if (!projectIdea) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Header
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Idea', href: '/idea' },
          { label: 'Planning', href: '/idea/scanning' },
        ]}
        showStartNewScan={false}
      />
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 flex items-center gap-3">
              <Lightbulb className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
              <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                Architecting: "{projectIdea.length > 30 ? projectIdea.substring(0, 30) + '...' : projectIdea}"
              </span>
            </Card>
          </motion.div>

          <div className="space-y-3 text-left">
            {STEPS.map((label, i) => {
              const isDone = i < activeStep;
              const isActive = i === activeStep;
              return (
                <motion.div 
                  key={label} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--color-success)' }} />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 shrink-0 animate-spin" style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <Circle className="w-5 h-5 shrink-0" style={{ color: 'var(--color-text-faint)' }} />
                  )}
                  <span
                    className={cn(
                      'text-sm transition-colors',
                      isDone ? 'text-[var(--color-text)]' : isActive ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-faint)]'
                    )}
                  >
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            ~{countdown}s
          </p>

          <AnimatePresence mode="wait">
            <motion.p 
              key={factIndex}
              className="text-sm min-h-[2.5rem]" 
              style={{ color: 'var(--color-text-muted)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {FUN_FACTS[factIndex]}
            </motion.p>
          </AnimatePresence>

          {error && (
            <Card className="p-4 space-y-3" style={{ borderColor: 'var(--color-error)' }}>
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
              <Button onClick={handleRetry}>Try Again</Button>
            </Card>
          )}

          {!error && (
            <button
              onClick={() => setShowCancel(true)}
              className="text-xs underline"
              style={{ color: 'var(--color-text-faint)' }}
            >
              Cancel planning
            </button>
          )}
        </div>
      </main>

      <Modal open={showCancel} onClose={() => setShowCancel(false)} title="Cancel Planning?">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          This will stop generating the blueprint and return you to the home page.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setShowCancel(false)}>Keep Planning</Button>
          <Button variant="danger" onClick={handleCancel}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
