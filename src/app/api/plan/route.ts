import { NextResponse } from 'next/server';
import { invokeClaude } from '@/lib/bedrock';

export async function POST(req: Request) {
  try {
    const { projectIdea, wantSuggestedSetup } = await req.json();

    if (!projectIdea) {
      return NextResponse.json({ success: false, error: 'Project idea is required.' }, { status: 400 });
    }

    let suggestedStack = null;

    if (wantSuggestedSetup) {
      const prompt = `
        You are an expert software architect prioritizing green, sustainable hosting.
        The user wants to build a project with this idea: "${projectIdea}"
        Suggest a highly optimized, low-cardon stack. Feel free to use serverless, static sites, or edge computing.
        Return purely as JSON matching this TypeScript interface exactly, nothing else:
        {
          "cloudProvider": "AWS" | "GCP" | "Azure" | "Vercel" | "Netlify" | "DigitalOcean" | "Cloudflare" | "Render" | "Fly.io" | "Railway",
          "cloudService": "EC2" | "Lambda" | "ECS" | "Cloud Run" | "Compute Engine" | "Azure App Service" | "Vercel Functions" | "Vercel Edge" | "Netlify Functions" | "Netlify Edge" | "Cloudflare Workers" | "Cloudflare Pages" | "App Platform" | "Droplet" | "Render Web Service" | "Render Static Site",
          "region": "us-west-1" | "us-east-1" | "eu-central-1" | "eu-west-1",
          "isServerless": true | false,
          "frontendFramework": "Next.js" | "React" | "Vue" | "Astro" | "SvelteKit" | "HTML / Vanilla",
          "cicdTool": "GitHub Actions" | "GitLab CI" | "Vercel" | "CircleCI",
          "hasCaching": true | false,
          "rationale": "One-sentence explanation of why this is green and efficient.",
          "greenPractices": ["string", "string"]
        }
      `;

      try {
        const responseText = await invokeClaude(prompt);
        // Find JSON block
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          suggestedStack = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.error("Bedrock generation failed, using mock stack:", err);
      }
    }

    if (!suggestedStack) {
      suggestedStack = {
        cloudProvider: "Cloudflare",
        cloudService: "Cloudflare Pages",
        region: "Global Edge",
        isServerless: true,
        frontendFramework: "Astro",
        cicdTool: "GitHub Actions",
        hasCaching: true,
        rationale: "Shipping minimal JS to the edge ensures ultra-low energy consumption.",
        greenPractices: ["Zero JS by default", "Asset optimization", "Edge caching"]
      };
    }

    // A robust mock plan result that mirrors the AnalysisResult structure.
    const planResult = {
      planId: `plan_${Date.now()}`,
      projectIdea,
      scannedAt: new Date().toISOString(),
      sustainabilityScore: 92,
      scoreLabel: 'Low Impact',
      subscores: [
        {
          id: 'compute',
          label: 'Compute Efficiency',
          score: 95,
          grade: 'A',
          summary: 'Serverless scaling prevents idle resource waste.',
          issueCount: 1
        },
        {
          id: 'assets',
          label: 'Asset Optimization',
          score: 88,
          grade: 'B',
          summary: 'Edge caching significantly reduces bandwidth overhead.',
          issueCount: 0
        }
      ],
      issues: [
        {
          id: 'i1',
          category: 'compute',
          impact: 'LOW',
          title: 'Database connection pooling overhead',
          description: 'Serverless functions can overwhelm traditional databases without pooling.',
          affectedFiles: ['Infrastructure'],
          estimatedMonthlyCO2: '0.1',
          estimatedMonthlyCost: '0.20'
        }
      ],
      recommendations: [
        {
          id: 'r1',
          issueId: 'i1',
          title: 'Utilize connection pooling (e.g. PgBouncer, Prisma Accelerate)',
          description: 'Connection pooling prevents database exhaustion from serverless scaling.',
          impact: 'MEDIUM',
          effort: 'LOW',
          estimatedCO2Saved: '0.2 kg',
          estimatedCostSaved: '$5.00'
        }
      ],
      before: {
        estimatedMonthlyCost: '12.00',
        estimatedMonthlyCO2: '2.5',
        energySavings: '0',
        timeSaved: '0',
        bandwidthSaved: '0',
        monthlyComputeHours: 100,
        monthlyCIRuns: 30,
        monthlyRequests: 5000,
        label: 'before'
      },
      after: {
        estimatedMonthlyCost: '3.50',
        estimatedMonthlyCO2: '0.4',
        energySavings: '84%',
        timeSaved: '5 hrs',
        bandwidthSaved: '2.5GB',
        monthlyComputeHours: 15,
        monthlyCIRuns: 15,
        monthlyRequests: 5000,
        label: 'after'
      },
      report: {
        plainEnglish: "Your project idea has been mapped to a highly efficient architecture. By using edge computing and static generation, you minimize resource usage while maximizing performance.",
        technical: "The suggested architecture relies on stateless edge functions and aggressively cached static assets, decoupling compute from state and reducing cold starts.",
        sustainability: "This setup minimizes carbon emissions by ensuring that servers only run when actively processing a request, eliminating idle consumption.",
        pitch: "A blazing-fast, globally distributed web app that scales instantly to zero, minimizing both your AWS bill and your carbon footprint."
      },
      suggestedStack,
      effectiveConfig: {
        cloudProvider: suggestedStack.cloudProvider,
        cloudService: suggestedStack.cloudService,
        region: suggestedStack.region,
        isServerless: suggestedStack.isServerless,
        cicdTool: suggestedStack.cicdTool,
        hasCaching: suggestedStack.hasCaching,
        frontendFramework: suggestedStack.frontendFramework
      }
    };

    return NextResponse.json({ success: true, data: planResult });
  } catch (error) {
    console.error('API /plan error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
