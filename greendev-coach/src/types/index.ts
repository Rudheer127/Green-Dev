export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type EffortLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ScanStatus = 'pending' | 'scanning' | 'complete' | 'error';
export type AWSService = 'EC2' | 'Lambda' | 'ECS' | 'Elastic Beanstalk' | 'Amplify' | 'Other';
export type CICDTool = 'GitHub Actions' | 'CircleCI' | 'Jenkins' | 'None' | 'Other';
export type CIFrequency = 'every-push' | 'pr-only' | 'scheduled' | 'manual';
export type FrontendFramework = 'React' | 'Next.js' | 'Vue' | 'Svelte' | 'None';

export interface DeploymentConfig {
  awsService: AWSService;
  region: string;
  instanceType: string;
  isServerless: boolean;
  cicdTool: CICDTool;
  ciFrequency: CIFrequency;
  hasCaching: boolean;
  frontendFramework: FrontendFramework;
}

export interface ScanRequest {
  repoUrl: string;
  deploymentConfig: DeploymentConfig;
}

export interface Issue {
  id: string;
  category: 'ci-cd' | 'compute' | 'storage' | 'networking' | 'dependencies' | 'assets';
  title: string;
  description: string;
  impact: ImpactLevel;
  affectedFiles?: string[];
  estimatedMonthlyCO2?: string;
  estimatedMonthlyCost?: string;
}

export interface Recommendation {
  id: string;
  issueId: string;
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  awsAlternative?: string;
  estimatedCO2Saved?: string;
  estimatedCostSaved?: string;
  implementationGuide?: string;
}

export interface BeforeAfterState {
  monthlyComputeHours: number;
  monthlyCIRuns: number;
  estimatedMonthlyCost: string;
  estimatedMonthlyCO2: string;
  label: 'before' | 'after';
}

export interface AIReport {
  plainEnglish: string;
  technical: string;
  sustainability: string;
  pitch: string;
}

export interface AnalysisResult {
  scanId: string;
  repoUrl: string;
  repoName: string;
  scannedAt: string;
  sustainabilityScore: number;
  scoreLabel: 'Low Impact' | 'Moderate Impact' | 'High Impact';
  issues: Issue[];
  recommendations: Recommendation[];
  before: BeforeAfterState;
  after: BeforeAfterState;
  report: AIReport;
  detectedStack: {
    hasDockerfile: boolean;
    hasGithubActions: boolean;
    ciTriggerCount: number;
    estimatedImageSize?: string;
    frontendFramework?: string;
    dependencyCount?: number;
  };
}

export interface AppState {
  repoUrl: string;
  deploymentConfig: Partial<DeploymentConfig>;
  scanResult: AnalysisResult | null;
  scanId: string | null;
}

export type AppAction =
  | { type: 'SET_REPO_URL'; payload: string }
  | { type: 'SET_DEPLOYMENT_CONFIG'; payload: Partial<DeploymentConfig> }
  | { type: 'SET_SCAN_RESULT'; payload: AnalysisResult }
  | { type: 'SET_SCAN_ID'; payload: string }
  | { type: 'RESET_ALL' };
