'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { BackButton } from '@/components/layout/BackButton';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { useAppState, useAppDispatch } from '@/lib/store';
import { AWSService, CICDTool, CIFrequency, FrontendFramework } from '@/types';

const AWS_SERVICES = [
  { value: 'EC2', label: 'EC2' },
  { value: 'Lambda', label: 'Lambda' },
  { value: 'ECS', label: 'ECS' },
  { value: 'Elastic Beanstalk', label: 'Elastic Beanstalk' },
  { value: 'Amplify', label: 'Amplify' },
  { value: 'Other', label: 'Other' },
];

const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-2', label: 'US West (Oregon) — Greenest' },
  { value: 'eu-west-1', label: 'EU (Ireland) — Green' },
  { value: 'eu-north-1', label: 'EU (Stockholm) — Greenest' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ca-central-1', label: 'Canada (Central) — Green' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
];

const CICD_TOOLS = [
  { value: 'GitHub Actions', label: 'GitHub Actions' },
  { value: 'CircleCI', label: 'CircleCI' },
  { value: 'Jenkins', label: 'Jenkins' },
  { value: 'None', label: 'None' },
  { value: 'Other', label: 'Other' },
];

const CI_FREQUENCIES = [
  { value: 'every-push', label: 'Every push' },
  { value: 'pr-only', label: 'PR only' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'manual', label: 'Manual' },
];

const FRAMEWORKS = [
  { value: 'React', label: 'React' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Svelte', label: 'Svelte' },
  { value: 'None', label: 'None / Other' },
];

export default function AnalyzePage() {
  const { repoUrl, deploymentConfig } = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form state
  const [awsService, setAwsService] = useState<AWSService>((deploymentConfig.awsService as AWSService) || 'EC2');
  const [region, setRegion] = useState(deploymentConfig.region || 'us-east-1');
  const [isServerless, setIsServerless] = useState(deploymentConfig.isServerless ?? false);
  const [instanceType, setInstanceType] = useState(deploymentConfig.instanceType || '');
  const [cicdTool, setCicdTool] = useState<CICDTool>((deploymentConfig.cicdTool as CICDTool) || 'GitHub Actions');
  const [ciFrequency, setCiFrequency] = useState<CIFrequency>((deploymentConfig.ciFrequency as CIFrequency) || 'every-push');
  const [hasCaching, setHasCaching] = useState(deploymentConfig.hasCaching ?? false);
  const [framework, setFramework] = useState<FrontendFramework>((deploymentConfig.frontendFramework as FrontendFramework) || 'React');

  useEffect(() => {
    if (!repoUrl) router.replace('/');
  }, [repoUrl, router]);

  if (!repoUrl) return null;

  function handleSubmit() {
    dispatch({
      type: 'SET_DEPLOYMENT_CONFIG',
      payload: {
        awsService,
        region,
        instanceType: isServerless ? '' : instanceType,
        isServerless,
        cicdTool,
        ciFrequency,
        hasCaching,
        frontendFramework: framework,
      },
    });
    router.push('/scanning');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Header
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Configure', href: '/analyze' },
        ]}
      />
      <main id="main-content" className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <BackButton href="/" label="Back to Home" />

        <div className="flex justify-center my-6">
          <ProgressBar currentStep={2} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form column */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 space-y-6" elevated>
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                      Deployment Setup
                    </h1>

                    <SegmentedControl
                      label="AWS Service"
                      options={AWS_SERVICES}
                      value={awsService}
                      onChange={(v) => setAwsService(v as AWSService)}
                    />

                    <Select
                      label="AWS Region"
                      options={AWS_REGIONS}
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />

                    <Toggle
                      label="Compute Type"
                      labelOff="Always-on"
                      labelOn="Serverless"
                      checked={isServerless}
                      onChange={setIsServerless}
                    />

                    {!isServerless && (
                      <Input
                        label="Instance Type"
                        placeholder="e.g. t3.micro"
                        value={instanceType}
                        onChange={(e) => setInstanceType(e.target.value)}
                      />
                    )}

                    <Button size="lg" className="w-full sm:w-auto" onClick={() => setStep(2)}>
                      Next: CI/CD Details →
                    </Button>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 space-y-6" elevated>
                <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  CI/CD &amp; Pipeline
                </h1>

                <SegmentedControl
                  label="CI/CD Tool"
                  options={CICD_TOOLS}
                  value={cicdTool}
                  onChange={(v) => setCicdTool(v as CICDTool)}
                />

                <Select
                  label="How often does your pipeline run?"
                  options={CI_FREQUENCIES}
                  value={ciFrequency}
                  onChange={(e) => setCiFrequency(e.target.value as CIFrequency)}
                />

                <Toggle
                  label="Caching configured?"
                  labelOff="No"
                  labelOn="Yes"
                  checked={hasCaching}
                  onChange={setHasCaching}
                />

                <Select
                  label="Frontend Framework"
                  options={FRAMEWORKS}
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as FrontendFramework)}
                />

                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    ← Back to Deployment
                  </Button>
                    <Button size="lg" onClick={handleSubmit}>
                      Analyze My Repo →
                    </Button>
                  </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right tips panel */}
          <motion.div 
            className="hidden lg:block space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-5 space-y-3" tinted>
              <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Why we ask this
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Knowing your AWS setup lets us compare your current deployment against greener alternatives. We don&apos;t access your AWS account — we only use what you tell us.
              </p>
            </Card>
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                💡 Quick tip
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {awsService === 'EC2'
                  ? 'EC2 instances run 24/7 even when idle. For student projects, Lambda or Amplify usually costs 90% less.'
                  : awsService === 'Lambda'
                  ? 'Great choice! Lambda scales to zero, meaning you only pay for what you use.'
                  : 'Most student projects can save significantly by going serverless.'}
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
