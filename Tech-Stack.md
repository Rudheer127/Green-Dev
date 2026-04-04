# GreenDev Coach — Tech Stack Document

## 1. Executive Summary

GreenDev Coach is an AI-powered sustainability coach for student developers designed to identify cloud waste and provide actionable mitigation strategies. To walk the talk, GreenDev Coach’s technical architecture heavily emphasizes zero-idle compute, event-driven scalability, and energy-optimized operations. We utilize Next.js on Vercel for scalable edge delivery, Supabase for a robust PostgreSQL backend with Row Level Security and pgvector caching, and a Python-based serverless worker pool (AWS Lambda/Fargate) powered by Tree-sitter for deep AST static analysis. Rather than sending raw code to LLMs—a wasteful and error-prone approach—our deterministic engine generates structured findings JSON. AWS Bedrock utilizing Claude Sonnet 4.6 on Inferentia hardware then consumes these findings to generate highly contextualized, cached, and token-efficient narrative reports, streamed in real time to the user.

---

## 2. Architecture Overview

### High-Level System Architecture

```text
+-----------------------------------------------------------------------------+
|                                User Interface                               |
|  [Next.js 16 App] -> Tailwind CSS, shadcn/ui, Recharts, Vercel AI SDK      |
|  (Hosted on Vercel CDN Edge)                                                |
+-----------------------------------------------------------------------------+
         | (Submit Repo URL & Config)                       ^ (Stream AI Report)
         v                                                  |
+-----------------------------------------------------------------------------+
|                                App Backend                                  |
|  [Supabase]                                                                 |
|  - Postgres (Users, Scans, Findings, Cache) + pgvector + RLS               |
|  - Edge Functions (Enqueuer, Status Poller, Webhook Handler)                |
|  - Auth & Storage (JSON/PDF Reports)                                        |
+-----------------------------------------------------------------------------+
         | (Enqueue Scan Job)                               ^ (Write Results)
         v                                                  |
+-----------------------------------------------------------------------------+
|  [AWS SQS Queue] -> Event-Driven Task Broker                                |
+-----------------------------------------------------------------------------+
         | (Trigger Worker)                                 | (Cache Hits)
         v                                                  |
+-----------------------------------------------------------------------------+
|                             Analysis Engine                                 |
|  [Python 3.12 Worker] (AWS Lambda for <60s or Fargate for Deep Scans)      |
|  -> PyGithub: Fetch file tree/manifests                                     |
|  -> Tree-sitter: AST Parsing (Docker, YAML, JSON, Code)                     |
|  -> Rule Engine: Deterministic Heuristics -> Impact Model -> Findings JSON  |
+-----------------------------------------------------------------------------+
         | (Cache Miss - Findings JSON)                     ^
         v                                                  |
+-----------------------------------------------------------------------------+
|                                  AI Layer                                   |
|  [AWS Bedrock]                                                              |
|  - Claude Sonnet 4.6 (Hosted on Inferentia Hardware)                        |
|  - Orchestrator checks Supabase pgvector Cache -> Bypasses LLM if hit       |
|  - Streams explainability & narrative reports                               |
+-----------------------------------------------------------------------------+
```

### Data Flow
1. **User Submission:** User submits GitHub URL and deployment form via Next.js frontend.
2. **Enqueuing:** A Next.js API route passes the request to a Supabase Edge Function, which authenticates the request and pushes a job to AWS SQS.
3. **Execution:** An event source mapping triggers a Python worker (AWS Lambda for small repos, Fargate for complex).
4. **Analysis:** The worker uses PyGithub to fetch required files only (no full clones unless necessary). Tree-sitter parses the files into normalized ASTs.
5. **Rule Processing:** Independence deterministic functions evaluate ASTs, generating a structured findings payload scored by an impact heuristic model. Raw findings are written back to Supabase.
6. **AI Orchestration:** The backend checks `cached_explanations` in Supabase using the finding signature. 
7. **Inference / Generation:** Cache misses trigger AWS Bedrock (Claude Sonnet 4.6), passing *only* the structured findings JSON. 
8. **Delivery:** The generated report/explanation is cached in Supabase and streamed directly back to the Next.js frontend via the Vercel AI SDK.

---

## 3. Frontend Stack

- **Framework: Next.js 16 (App Router)**
  Chosen for its robust App Router offering excellent Server-Side Rendering (SSR) and seamless streaming capabilities essential for consuming live Bedrock AI responses.
- **Styling: Tailwind CSS + shadcn/ui**
  Provides a highly customizable, zero-runtime utility-first styling system resulting in extremely optimized bundle sizes. shadcn/ui handles copy-paste accessible components for forms, dashboards, and modal dialogs rapidly.
- **Data Fetching: SWR / TanStack Query**
  Utilized to manage client-side state and provide smart, resilient long-polling for scan status updates while the async SQS worker processes the repository.
- **AI Streaming: Vercel AI SDK**
  Abstracts the complexity of parsing stream chunks from Claude to the UI. Delivers a fluid, ChatGPT-like typing experience as narrative summaries generate in real-time.
- **Visualization: Recharts**
  A lightweight, React-native composable charting library. Required for rendering circular sustainability score gauges and stacked bar charts for before/after impact narratives.
- **Deployment: Vercel**
  Native support for Next.js App Router caching, streaming edge functions, and global static asset delivery.

---

## 4. App Backend Stack

The application's core data API layer relies upon **Supabase** acting as a unified Backend-as-a-Service, ensuring speed, scalability, and secure per-user environments without managing database servers.

- **Database:** Supabase Postgres.
- **RLS (Row Level Security):** Strict RLS policies are applied to all tables. Users may only `SELECT`, `INSERT`, `UPDATE` rows where `user_id == auth.uid()`. Unauthenticated public scans are linked via anonymous session IDs.
- **Vector Store:** `pgvector` extension is enabled to store embeddings of repo finding patterns, empowering semantic cache detection for similar architectural flaws without re-running identical prompts through Claude.
- **Storage:** Supabase Storage securely holds generated artifact exports (JSON dumps, PDF reports).
- **Auth:** Supabase Auth providing GitHub OAuth for developer seamlessness.
- **Lightweight Logic:** Supabase Edge Functions (Deno) restrict heavy server operations. They handle:
  - Validating payloads and pushing jobs securely to AWS SQS via HTTP.
  - Managing external webhook returns from Github/AWS.
  - Generating S3/Supabase Storage signed URLs to download reports.

### Database Schema Overview (Key PostgreSQL Tables)
- `users`: Standard auth mappings.
- `scans`: Tracks scan status (`queued`, `processing`, `completed`, `failed`), `repo_url`, and `deployment_config`.
- `findings`: Granular analysis flags tied to a `scan_id`.
- `recommendations`: Actionable steps mapped to findings.
- `reports`: Finalized AI-generated output structures.
- `cached_explanations`: Stores prompt signatures / MD5 hashes mapped to valid Claude responses to bypass redundant Bedrock invocation.

---

## 5. Analysis Engine

The backbone of GreenDev Coach is deterministic logic; we do NOT send arbitrary code to an LLM.

- **Worker Environment:** Python 3.12 executed on **AWS Lambda** (for scans under 60 seconds) or **AWS ECS Fargate** (for deeper, multi-service monoliths). AWS SQS handles dispatch buffering.
- **Parsing Tech:** **Tree-sitter**. The exact engine underlying GitHub's CodeQL. Standardizes un-structured code into structured AST (Abstract Syntax Trees) enabling resilient pattern detection across Dockerfiles, YAML (Actions/Configs), and JSON.
- **Repository Access:** **PyGithub**. Evaluates the file tree using REST prior to downloading distinct files (e.g., `package.json`, `.github/workflows/main.yml`). Limits massive data egress. GitPython is heavily isolated only for edge-cases needing dependency tree traversals.
- **Rule Design Pattern:** Each heuristic check is an isolated, testable function.
  - *Input:* Normalized AST file model.
  - *Output:* Finding Object `{ rule_id, issue, severity, impact_heuristic, effort_heuristic, aws_alternative, evidence_snippet }`.
- **Primary Rules Enforced:**
  - *CI Frequency:* Flagging redundant `pull_request` hooks lacking path-filtering.
  - *Docker Bloat:* Spotting missing `.dockerignore` files or single-stage builds utilizing heavy base images (e.g., `node:18` vs `node:18-alpine`).
  - *Always-On Compute:* Detecting static sites being containerized instead of CDN-hosted.
  - *Caching:* Missing caching blocks within package manager steps in CI.
  - *Region Selection:* Identifying AWS regions with higher grid carbon intensities.

---

## 6. AI Layer

AI is utilized purely as an orchestration, reasoning, and presentation layer.

- **Platform & Model:** **Amazon Bedrock** providing **Claude Sonnet 4.6**. Sonnet is selected for its superior logic-to-cost ratio and high steerability for structured formatting.
- **Hardware Profile:** Executed strictly matching AWS Inferentia clusters supported by Bedrock, operating at roughly 70% lower energy cost & financial cost over GPU clusters.
- **Prompt Contract Design:** Bedrock is provided rigorously sanitized **structured findings JSON** alongside a strict system prompt. No raw code snippets exceeding 20 lines are passed. Token sizes are minimized (approx. 500-1500 input tokens max).
- **Inference Caching Architecture:**
  Before consulting Bedrock, the worker queries the Supabase `cached_explanations` table using a deterministic key: `Hash(rule_id + severity + aws_service_context)`. If a hit returns, the system streams the cached response.
  - *Cache TTL:* 30 days. Ensures outputs update if underlying Bedrock models or prompt contexts slightly evolve over the month.
- **Next.js Streaming Integration:** A backend Edge function catches the stream from Bedrock and maps it to `Vercel AI SDK` formats to render character-by-character on the user's dashboard.

---

## 7. Infrastructure & DevOps

- **IaC (Infrastructure as Code):** **AWS CDK v2 (TypeScript)**. Definitively tracks SQS queues, Lambda functions, ECS Fargate clusters, IAM roles, and Bedrock policies in reproducible stacks.
- **CI/CD:**
  - *Frontend:* Vercel native GitHub integration (Deploy to Preview/Prod on git triggers).
  - *Backend Worker:* GitHub Actions runs pytest matrices and uses CDK to synthesize and deploy the Python Lambda / Dockerize Fargate containers on branch merges.
- **Secrets Management:** 
  - Vercel Environment Variables configured strictly for UI needs (e.g., Supabase anon keys).
  - **AWS Secrets Manager** handles Bedrock API configurations, GitHub access tokens, and Supabase service-role keys utilized exclusively inside the secure VPC boundary.
- **Observability:**
  - *AWS CloudWatch:* Aggregates Lambda/Fargate execution logs, error traces, and SQS queue depth alarms.
  - *Supabase Dashboard:* Tracks database throughput and connection pool health.

---

## 8. Data Models

### Postgres Database Schemas (Supabase)

```sql
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  repo_url TEXT NOT NULL,
  deployment_config JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'queued',
  sustainability_score INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  rule_id VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  impact VARCHAR(20) NOT NULL,
  effort VARCHAR(20) NOT NULL,
  aws_alternative TEXT,
  evidence TEXT NOT NULL
);

CREATE TABLE cached_explanations (
  hash_key VARCHAR(256) PRIMARY KEY, /* Hash of rule_id + context */
  explanation_text TEXT NOT NULL,
  embedding vector(1536), /* Used for semantic similarity matching */
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Prompt Input Contract (Findings JSON Schema)
*This is the ONLY data payload Bedrock receives for the report generation phase.*

```json
{
  "scan_metadata": {
    "framework": "Next.js",
    "deployment_target": "AWS EC2",
    "is_serverless": false
  },
  "findings": [
    {
      "rule_id": "DOCKER_BASE_IMAGE_BLOAT",
      "severity": "HIGH",
      "impact": "HIGH",
      "aws_alternative": "AWS App Runner",
      "evidence": "FROM node:18 observed in Dockerfile. Unoptimized image sizing."
    },
    {
      "rule_id": "CI_CACHE_MISSING",
      "severity": "MEDIUM",
      "impact": "MEDIUM",
      "aws_alternative": null,
      "evidence": "No actions/cache step found in build.yml."
    }
  ]
}
```

### Bedrock Output / Report JSON Schema
```json
{
  "score": 42,
  "summaries": {
    "plain_english": "Your app uses a large, heavy foundation resulting in slow deployments. We recommend...",
    "technical": "Missing layer caching in CI leads to 40% increased EC2 build time...",
    "sustainability": "By keeping a persistent server active rather than scaling to zero...",
    "pitch": "GreenDev Coach identified 3 architectural pivots reducing overall footprint by an estimated 65%..."
  },
  "recommendations": [
    {
      "category": "Infrastructure",
      "title": "Migrate to Alpine Base Image",
      "effort_estimate": "LOW",
      "explanation": "Switching your Dockerfile to use node:18-alpine removes 600MB of unnecessary OS libraries..."
    }
  ]
}
```

---

## 9. Sustainability Audit

GreenDev Coach strictly enforces its own principles to maintain absolute architectural integrity:
- **Zero Idle Compute:** Every layer of our stack scales to exactly zero when not utilized. Next.js functions via Edge runtimes, Supabase utilizes pause capabilities (or serverless connection pooling), and the python worker triggers explicitly on SQS events via Lambda.
- **Caching over Generation:** The pgvector similarity cache ensures that if 1,000 hackathon teams make the same Docker mistake, Claude is invoked once. The remaining 999 requests cost 0 external API calls and emit zero generative hardware heat.
- **Hardware Optimization:** Invoking Bedrock AI generation explicitly via AWS Inferentia clusters ensures maximum power-per-watt efficiency targeting text-models.
- **Small Payload Sizes:** Delivering concise JSON structured data to the LLM drastically reduces the contextual window size processing required versus uploading raw codebase files.

---

## 10. Scalability Path

The core MVP architecture maps linearly into a tier-1 SaaS product with zero rip-and-replace rewrites:
- **Frontend:** Vercel Edge caching supports localized global delivery natively without structural modifications.
- **Database:** Supabase scales connection poolers vertically. As multi-tenant teams become a feature, Postgres RLS natively walls off organization data perfectly.
- **Workers:** SQS seamlessly scales AWS Lambda to 1,000 concurrent executions out of the box. Heavy enterprise monoliths that breach Lambda’s 15-minute runtime and RAM boundaries natively fall back to AWS ECS Fargate definitions utilizing the exact same underlying Docker container handling.
- **AI Tiers:** Rate limits imposed by Bedrock can be managed via API Gateway limits or by increasing the Provisioned Throughput quota as MRR grows.

---

## 11. Risk Register

| Risk | Affected Layer | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **GitHub API Throttling** (HTTP 429) | Analysis Engine | High | Supabase Edge functions prevent concurrent user spam. PyGithub utilizes authenticated fallback tokens to boost standard 60/hr limits to 5,000/hr. |
| **Lambda Timeout (>15 min)** | Analysis Engine | Medium | Enforce Git shallow-checks and strict timeout try/catch blocks. Gracefully exit with partial findings instead of a hard crash. Shift monolithic repos to Fargate worker routing. |
| **Bedrock Quota Limits** | AI Layer | Medium | Fallback to displaying raw rules-based finding JSON in UI if Bedrock streaming fails (graceful degradation natively without narrative). |
| **AST Parser Failure** | Analysis Engine | Low | Tree-sitter exceptions fallback to Regex-based pattern matching as a defensive heuristic strategy. |

---

## 12. Dependencies & Versions

| Component | Library / Service | Pinned Version Range |
| :--- | :--- | :--- |
| Framework | Next.js | `^14.2.0` / App Router |
| Server UI Component | React / React DOM | `^18.3.0` |
| Styling UI | Tailwind CSS | `^3.4.0` |
| UI Primitives | shadcn/ui | `latest` (radix-ui dependencies isolated) |
| Backend SDK | `@supabase/supabase-js` | `^2.42.0` |
| AI SDK | `ai` (Vercel) | `^3.1.0` |
| Visualizer | Recharts | `^2.12.0` |
| Data Fetching | `swr` | `^2.2.0` |
| Worker Environment | Python | `~3.12` |
| Code Parsing | `tree-sitter` | `^0.21.0` |
| GitHub Access | `PyGithub` | `^2.3.0` |
| IaC Framework | `aws-cdk-lib` | `^2.135.0` |
| Cloud Inference | AWS Bedrock | Claude Sonnet v3/4 API Config |

---
*End of Document*
