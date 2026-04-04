import { AnalysisResult } from '@/types';

export const FALLBACK_TEXT = `Technical analysis identified the following key inefficiencies: always-on compute with high idle ratio, unoptimized CI/CD pipeline without dependency caching, and oversized container images. Recommended actions: migrate to AWS Lambda or ECS Fargate for serverless compute, implement GitHub Actions caching, and adopt Alpine-based Docker base images. These changes are estimated to reduce monthly costs by 70–80% and cut carbon footprint proportionally.`;

export function buildTechnicalPrompt(result: AnalysisResult): string {
  return `You are a senior AWS solutions architect reviewing a student project.
Write a technical summary (3–4 paragraphs) for a developer audience.
Cover: what infrastructure patterns were detected, what the specific inefficiencies are, and the concrete AWS-native alternatives that should be adopted.
Include specific service names (Lambda, S3, CloudFront, ECS Fargate, etc.)
Be direct and specific. No fluff.

Findings:
- Repo: ${result.repoUrl}
- Score: ${result.sustainabilityScore}/100 (${result.scoreLabel})
- Detected Stack: Dockerfile=${result.detectedStack.hasDockerfile}, GitHub Actions=${result.detectedStack.hasGithubActions}, Framework=${result.detectedStack.frontendFramework}, Dependencies=${result.detectedStack.dependencyCount}
- Issues:
${result.issues.map((i) => `  • [${i.impact}] ${i.title}: ${i.description}`).join('\n')}
- Recommended actions:
${result.recommendations.map((r) => `  • ${r.title} → AWS: ${r.awsAlternative || 'N/A'}`).join('\n')}`;
}
