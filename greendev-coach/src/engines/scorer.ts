import { Issue, BeforeAfterState, DeploymentConfig } from '@/types';

const ISSUE_WEIGHTS = {
  HIGH: 20,
  MEDIUM: 10,
  LOW: 5,
};

export function calculateScore(issues: Issue[]): {
  score: number;
  label: 'Low Impact' | 'Moderate Impact' | 'High Impact';
} {
  let score = 100;
  for (const issue of issues) {
    score -= ISSUE_WEIGHTS[issue.impact];
  }
  score = Math.max(0, Math.min(100, score));

  let label: 'Low Impact' | 'Moderate Impact' | 'High Impact';
  if (score >= 75) label = 'Low Impact';
  else if (score >= 45) label = 'Moderate Impact';
  else label = 'High Impact';

  return { score, label };
}

export function calculateBeforeAfter(
  config: DeploymentConfig,
  issues: Issue[]
): { before: BeforeAfterState; after: BeforeAfterState } {
  const isAlwaysOn = config.awsService === 'EC2' && !config.isServerless;
  const hasCI = config.cicdTool !== 'None';
  const ciEveryPush = config.ciFrequency === 'every-push';

  // BEFORE state
  const beforeComputeHours = isAlwaysOn ? 720 : 50;
  const beforeCIRuns = hasCI ? (ciEveryPush ? 120 : 30) : 0;

  let beforeCostNum = isAlwaysOn ? 18.4 : 4.2;
  if (hasCI && ciEveryPush) beforeCostNum += 4.0;
  const beforeCO2Num = isAlwaysOn ? 2.4 : 0.6;

  // AFTER: apply all recommendations
  const afterComputeHours = isAlwaysOn ? 48 : beforeComputeHours;
  const afterCIRuns = ciEveryPush ? 30 : beforeCIRuns;

  let afterCostNum = isAlwaysOn ? 3.2 : beforeCostNum;
  if (ciEveryPush) afterCostNum = Math.max(afterCostNum - 2.5, 1.0);
  const afterCO2Num = isAlwaysOn ? 0.4 : beforeCO2Num * 0.6;

  return {
    before: {
      monthlyComputeHours: beforeComputeHours,
      monthlyCIRuns: beforeCIRuns,
      estimatedMonthlyCost: `$${beforeCostNum.toFixed(2)}`,
      estimatedMonthlyCO2: `${beforeCO2Num.toFixed(1)}kg`,
      label: 'before',
    },
    after: {
      monthlyComputeHours: afterComputeHours,
      monthlyCIRuns: afterCIRuns,
      estimatedMonthlyCost: `$${afterCostNum.toFixed(2)}`,
      estimatedMonthlyCO2: `${afterCO2Num.toFixed(1)}kg`,
      label: 'after',
    },
  };
}
