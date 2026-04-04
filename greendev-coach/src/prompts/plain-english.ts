import { AnalysisResult } from '@/types';

export const FALLBACK_TEXT = `Your project scored {score}/100. We identified {count} sustainability issues. The most impactful changes you can make right now are to review your compute architecture, optimize your CI/CD pipeline, and update your Docker base images. Each of these changes, taken individually, can meaningfully reduce both your cloud costs and your carbon footprint.`;

export function buildPlainEnglishPrompt(result: AnalysisResult): string {
  return `You are GreenDev Coach, a sustainability assistant for student developers.
Given these findings from a GitHub repo analysis, write a plain-English summary (3–4 paragraphs) that a student developer with no cloud expertise can understand.
Do not use jargon without explaining it. Be encouraging but honest.
Focus on the 2–3 most impactful changes they can make right now.
End with a one-sentence motivational close.

Findings:
- Repo: ${result.repoUrl}
- Sustainability Score: ${result.sustainabilityScore}/100 (${result.scoreLabel})
- Top Issues:
${result.issues.slice(0, 3).map((i) => `  • [${i.impact}] ${i.title}`).join('\n')}
- Top Recommendations:
${result.recommendations.slice(0, 3).map((r) => `  • ${r.title} (saves ${r.estimatedCostSaved || 'N/A'})`).join('\n')}
- Estimated savings if all changes applied: ${result.after.estimatedMonthlyCost}/month, ${result.after.estimatedMonthlyCO2} CO2`;
}
