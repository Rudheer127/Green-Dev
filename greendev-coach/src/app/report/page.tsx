'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { Copy, Download, Share2, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BackButton } from '@/components/layout/BackButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppState, useAppDispatch } from '@/lib/store';
import { cn } from '@/lib/utils';

const TAB_LABELS = [
  { id: 'plain', label: 'Plain English' },
  { id: 'technical', label: 'Technical' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'pitch', label: 'Pitch-Ready' },
];

export default function ReportPage() {
  const { scanResult } = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!scanResult) router.replace('/');
  }, [scanResult, router]);

  if (!scanResult) return null;

  const reportMap: Record<string, string> = {
    plain: scanResult.report?.plainEnglish || '',
    technical: scanResult.report?.technical || '',
    sustainability: scanResult.report?.sustainability || '',
    pitch: scanResult.report?.pitch || '',
  };

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    window.print();
  }

  async function handleShare() {
    if (!scanResult) return;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `GreenDev Coach Report — ${scanResult.repoName}`,
          text: `Sustainability score: ${scanResult.sustainabilityScore}/100`,
          url: window.location.href,
        });
      } catch { /* user dismissed */ }
    } else {
      handleCopy();
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Header
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Configure', href: '/analyze' },
          { label: 'Results', href: '/results' },
          { label: 'Report', href: '/report' },
        ]}
      />
      <main id="main-content" className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <BackButton href="/results" label="Back to Results" />
          <button
            onClick={() => { dispatch({ type: 'RESET_ALL' }); router.push('/'); }}
            className="text-xs underline" style={{ color: 'var(--color-text-faint)' }}
          >
            ← Start Over
          </button>
        </div>

        <motion.h1 
          className="text-2xl font-bold" 
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          AI Sustainability Report
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs.Root defaultValue="plain">
            <Tabs.List className="flex border-b mb-6" style={{ borderColor: 'var(--color-divider)' }} aria-label="Report format">
              {TAB_LABELS.map((tab) => (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap',
                    'data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]',
                    'data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--color-text-muted)] data-[state=inactive]:hover:text-[var(--color-text)]'
                  )}
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {TAB_LABELS.map((tab) => (
              <Tabs.Content key={tab.id} value={tab.id}>
                <article className="prose prose-sm max-w-none space-y-4">
                  {reportMap[tab.id].split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
                      {para}
                    </p>
                  ))}
                </article>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </motion.div>

        {/* Share panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Share this report</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5" /> Print / PDF
              </Button>
              <Button variant="secondary" size="sm" onClick={handleShare}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Metadata */}
        <motion.p 
          className="text-xs text-center pb-6" 
          style={{ color: 'var(--color-text-faint)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          Scan ID: {scanResult.scanId} · Scanned at {new Date(scanResult.scannedAt).toLocaleString()} · {scanResult.repoName}
        </motion.p>
      </main>
    </div>
  );
}
