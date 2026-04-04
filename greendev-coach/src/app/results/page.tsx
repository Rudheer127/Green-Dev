'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Leaf, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BackButton } from '@/components/layout/BackButton';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState, useAppDispatch } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const { scanResult } = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!scanResult) { router.replace('/'); return; }
    // Animate score from 0 to final
    const target = scanResult.sustainabilityScore;
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimatedScore(current);
      if (current >= target) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [scanResult, router]);

  if (!scanResult) return null;

  const scoreColor =
    scanResult.sustainabilityScore >= 75 ? 'var(--color-success)' :
    scanResult.sustainabilityScore >= 45 ? 'var(--color-gold)' :
    'var(--color-high)';

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0" style={{ background: 'var(--color-bg)' }}>
      <Header
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Configure', href: '/analyze' },
          { label: 'Results', href: '/results' },
        ]}
      />
      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <BackButton href="/analyze" label="Back to Config" />
          <button
            onClick={() => { dispatch({ type: 'RESET_ALL' }); router.push('/'); }}
            className="text-xs underline" style={{ color: 'var(--color-text-faint)' }}
          >
            ← Start Over
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Score Gauge */}
            <Card className="p-6 flex flex-col items-center gap-3" elevated>
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" role="meter" aria-valuenow={scanResult.sustainabilityScore} aria-valuemin={0} aria-valuemax={100}>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-surface-offset)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke={scoreColor} strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 800ms ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold" style={{ fontFamily: 'var(--font-display)', color: scoreColor }}>
                    {animatedScore}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/100</span>
                </div>
              </div>
              <Badge variant="impact" level={scanResult.sustainabilityScore >= 75 ? 'LOW' : scanResult.sustainabilityScore >= 45 ? 'MEDIUM' : 'HIGH'}>
                {scanResult.scoreLabel}
              </Badge>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Based on {scanResult.issues.length} factors analyzed
              </p>
            </Card>

            {/* Issues */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>What We Found</h2>
              {scanResult.issues.slice(0, 5).map((issue, idx) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <button
                      onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                      aria-expanded={expandedIssue === issue.id}
                      className="w-full flex items-center gap-3 p-4 text-left"
                    >
                      <Badge variant="impact" level={issue.impact}>{issue.impact}</Badge>
                      <span className="flex-1 text-sm font-medium">{issue.title}</span>
                      {expandedIssue === issue.id ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </button>
                    {expandedIssue === issue.id && (
                      <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: 'var(--color-divider)' }}>
                        <p className="text-sm pt-3" style={{ color: 'var(--color-text-muted)' }}>{issue.description}</p>
                        {issue.affectedFiles && (
                          <div className="text-xs space-y-0.5" style={{ color: 'var(--color-text-faint)' }}>
                            <span className="font-medium">Files:</span>
                            {issue.affectedFiles.map((f) => <div key={f} className="font-mono">{f}</div>)}
                          </div>
                        )}
                        {(issue.estimatedMonthlyCO2 || issue.estimatedMonthlyCost) && (
                          <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>
                            Est: {issue.estimatedMonthlyCO2 && `${issue.estimatedMonthlyCO2} CO₂`}{issue.estimatedMonthlyCost && ` · ${issue.estimatedMonthlyCost}`}/month
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Recommendations */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Recommendations</h2>
              {scanResult.recommendations.slice(0, 5).map((rec, idx) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                >
                  <Card className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold flex-1">{rec.title}</span>
                      <Badge variant="impact" level={rec.impact}>Impact: {rec.impact}</Badge>
                      <Badge variant="effort" level={rec.effort}>Effort: {rec.effort}</Badge>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{rec.description}</p>
                    {rec.awsAlternative && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]" style={{ background: 'var(--color-primary-tint)' }}>
                        <Leaf className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>AWS: {rec.awsAlternative}</span>
                      </div>
                    )}
                    {rec.estimatedCO2Saved && (
                      <p className="text-xs" style={{ color: 'var(--color-success)' }}>Saves ~{rec.estimatedCO2Saved}{rec.estimatedCostSaved && ` · ${rec.estimatedCostSaved}`}</p>
                    )}
                    {rec.implementationGuide && (
                      <>
                        <button onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)} className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                          {expandedRec === rec.id ? '← Hide guide' : 'See implementation guide'}
                        </button>
                        {expandedRec === rec.id && (
                          <pre className="text-xs overflow-x-auto p-3 rounded-[var(--radius-md)] whitespace-pre-wrap" style={{ background: 'var(--color-surface-offset)', color: 'var(--color-text)' }}>
                            {rec.implementationGuide}
                          </pre>
                        )}
                      </>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Before / After */}
            <Card className="p-5 space-y-4" elevated>
              <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>Before → After</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="font-medium" style={{ color: 'var(--color-text-faint)' }}>Metric</div>
                <div className="font-medium" style={{ color: 'var(--color-high)' }}>Before</div>
                <div className="font-medium" style={{ color: 'var(--color-success)' }}>After</div>
                {[
                  { label: 'Cost', before: scanResult.before.estimatedMonthlyCost, after: scanResult.after.estimatedMonthlyCost },
                  { label: 'CO₂', before: scanResult.before.estimatedMonthlyCO2, after: scanResult.after.estimatedMonthlyCO2 },
                  { label: 'Compute hrs', before: String(scanResult.before.monthlyComputeHours), after: String(scanResult.after.monthlyComputeHours) },
                  { label: 'CI runs', before: String(scanResult.before.monthlyCIRuns), after: String(scanResult.after.monthlyCIRuns) },
                ].map((row) => (
                  <div key={row.label} className="contents">
                    <div className="text-left px-1 py-1" style={{ color: 'var(--color-text-muted)' }}>{row.label}</div>
                    <div className="font-mono py-1">{row.before}</div>
                    <div className="font-mono py-1" style={{ color: 'var(--color-success)' }}>{row.after}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Button size="lg" className="w-full" onClick={() => router.push('/report')}>
              View Full AI Report <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden flex items-center gap-3 px-4 h-16 border-t backdrop-blur-lg z-40" style={{ background: 'rgba(var(--color-bg), 0.85)', borderColor: 'var(--color-divider)' }}>
        <Button size="md" className="flex-1" onClick={() => router.push('/report')}>View AI Report →</Button>
      </div>
    </div>
  );
}
