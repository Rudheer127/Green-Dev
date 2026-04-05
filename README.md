# GreenDev Coach

**AI-assisted sustainability coaching for developers.** GreenDev Coach helps you **either** run a **full scan on a GitHub repo** **or** explore **planned infrastructure** before you have much code—so you can reduce cloud waste, cost, and estimated carbon footprint without needing billing APIs or full cloud account access.

Built for **[Amazon’s Sustainability Challenge](https://www.amazonfutureengineer.com/)** (Sustainability track): solutions should be **actionable today** and **scalable tomorrow**. GreenDev Coach targets **technical execution** (deterministic analysis + structured AI), **environmental impact** (greener regions, right-sized compute, CI/Docker efficiency), **innovation** (repo-aware coaching plus stack planning), and **feasibility** (standard APIs, managed services, no invasive AWS integration).

---

## What problem does this solve?

Millions of apps run on cloud infrastructure. Inefficient CI/CD, heavy containers, always-on servers when serverless would do, and **region choice** all add unnecessary energy use. GreenDev Coach meets developers **with a repo** (GitHub + declared deployment config) **or without one yet** (planned stack in the simulator) and turns that into prioritized, explainable guidance.

---

## Describe your idea *or* connect a repo

People land on the product at different stages. The README and the app support **both**:

| Situation | What to use | What you get |
|-----------|-------------|--------------|
| **You have a public GitHub repo** | Scan flow: paste the repo URL, then your deployment configuration. | Full **static analysis** (workflows, Dockerfile, manifests, optional API file hints), **sustainability score**, **issues**, **four AI report formats**, and **before/after** framing. |
| **You are still deciding the stack—or want to know what’s “best” before you build** | **What-If Simulator** in the app (route `/simulator`): describe your **planned** setup using the controls (cloud, region, compute pattern, frontend framework, CI/CD, serverless toggle, etc.) and compare scenarios. | **Scenario comparison** and green-score-style estimates so you can **choose greener options early**, without a repository. |
| **Hackathon pitch / judges / teammates** | You can **explain the idea in words** (problem, users, impact) and point people to **either** a **demo repo** for a live scan **or** the **simulator** to show architectural choices—depending on whether code exists yet. | Same product story; **repo** proves depth on real files; **simulator** proves intent when the project is still on paper. |

**Summary:** use a **repo** when you want evidence from real CI/Docker/code. Use the **simulator** when you want to **describe your idea as architecture choices** before coding, or to sanity-check what will work best with the product **before** you commit to a stack.

---

## How it works (end-to-end)

### Full repository scan

1. **You provide** a public GitHub repo URL and deployment configuration (cloud provider, region, how you run workloads, etc.).
2. **The app fetches** repository metadata, file tree, GitHub Actions workflows, Dockerfile (if present), `package.json` when available, and a small set of API/backend source files for optional code-aware hints.
3. **Deterministic engines** analyze CI/CD, Docker, assets/dependencies, compute choices, and region/carbon signals. They output structured **issues** with severity and categories—fast and repeatable.
4. **Scoring & catalog matching** produce a **0–100 sustainability score**, subscores, before/after estimates, and matched recommendations from an internal catalog.
5. **AWS Bedrock (Claude)** turns the structured findings into **four narrative reports** (plain English, technical, sustainability-focused, pitch-ready) and optional **code-level suggestions** from snippets—without sending your whole repo to the model; heuristics do the heavy lifting first.
6. **Results are returned** to the UI; each run can be **stored** in the database for history (see Backend below).

No user code is executed in sandboxes; analysis is **read-only** over the GitHub API and static file content.

### What-If Simulator (planning without a repo)

1. **You set** a “current” and an “alternative” configuration (provider, region, service type, framework, CI tool, traffic/load assumptions where shown).
2. **The API** (`/api/simulate`) applies **heuristic carbon and cost indices** to score and compare the two scenarios—useful when you want guidance **before** you have a public repo or while the codebase is private or not ready.
3. **Optional:** after a full scan, results can link into the simulator so you can iterate on **what-if** changes from a baseline that matches your last analysis.

---

## What you get

| Output | Purpose |
|--------|---------|
| **Sustainability score & labels** | Quick signal of overall posture |
| **Issue list** | CI, Docker, assets, compute, region—with impact levels |
| **Multi-format reports** | Same insights tuned for different readers |
| **Before/after estimates** | Rough monthly CO₂ framing from the model’s inputs (estimates, not metering) |
| **Rate limiting** | Fair use on the public API (see below) |
| **What-If Simulator** | Compare planned stacks side-by-side when you are **describing an idea** as architecture choices rather than uploading a repo |

---

## Architecture & stack

### Frontend

- **Next.js** (App Router), **React**, **Tailwind CSS**, **Radix UI**—fast UX for scanning, results, simulator, and education pages.

### “Backend” in practice

The product ships as a **Next.js full-stack app**: API routes orchestrate analysis. That keeps **one deployable unit**, simple operations, and a clear path to **horizontal scale** (serverless or container hosts) as usage grows.

| Layer | Technology | Why it fits this project |
|-------|----------------|---------------------------|
| **API & orchestration** | Next.js Route Handlers (`/api/analyze`, `/api/simulate`, …) | Single codebase, streaming-friendly, long-running work with `maxDuration` where the host allows—good for hackathon velocity and production iteration. |
| **Data & abuse control** | **Supabase (PostgreSQL)** | Managed Postgres for **scan history** (`scans`) and **IP rate limits** (`rate_limits`). JSON columns fit flexible analysis results; **RLS** can be enabled for stricter multi-tenant policies. Low ops overhead = feasible for teams and small orgs. |
| **AI** | **AWS Bedrock** (Claude Sonnet) | Stays on **AWS**, pairs with sustainability narratives around efficient cloud use, and consumes **compressed prompts** built from engine output—reducing token waste versus “dump the whole repo” approaches. |
| **Repo data** | **GitHub REST API** | No OAuth required for **public** repos; private repos need a token. |

### What we intentionally *don’t* require

- Live AWS account queries or Cost Explorer (reduces scope, security risk, and time-to-value).
- Running your tests or builds in our infrastructure.

This tradeoff favors **feasibility** and **trust**: we give strong guidance from manifests and configs many teams already have.

---

## Alignment with challenge judging (short)

| Criterion | How GreenDev Coach addresses it |
|-----------|-----------------------------------|
| **Innovation** | Combines **static/heuristic sustainability engines** with **LLM narration** and optional **targeted code analysis**—not generic chat over raw repos. |
| **Technical execution** | Typed engines, structured issues, Bedrock integration, persisted scans, rate limits, graceful fallbacks if AI calls fail. |
| **Environmental impact** | Surfaces **region**, **compute model**, **CI/Docker/asset** levers that directly affect energy and waste in typical dev workflows. |
| **Feasibility** | Uses **standard APIs** (GitHub, Bedrock) and **managed DB** (Supabase); deployable on common hosts (e.g. Vercel + Supabase + AWS credentials for Bedrock). |

---

## Getting started

### Prerequisites

- **Node.js 18+**
- **AWS account** with **Bedrock** access and credentials for the app
- **Supabase** project (for persistence and rate limiting)

### Install

```bash
git clone <your-repo-url>
cd Green-Dev
npm install
```

### Environment

Create `.env.local` in the project root and set:

```bash
# AWS (Bedrock)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# GitHub — optional for public repos; required for private
GITHUB_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional: `NEXT_PUBLIC_USE_MOCK=true` returns mock analysis data without calling GitHub or Bedrock (useful for UI demos).

### Database

Run `supabase.sql` in the Supabase SQL editor to create `rate_limits` and `scans`.

### Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key analysis themes (examples)

- **CI/CD** — redundant triggers, missing path filters, cache opportunities  
- **Docker** — base image weight, missing `.dockerignore`  
- **Assets & dependencies** — bloat signals from manifests and tree  
- **Compute** — serverless vs always-on patterns from your stated config  
- **Region** — greener-region nudges where data supports it  

---

## Development

```
src/
  app/           # Pages & API routes
  components/    # UI
  engines/       # CI, Docker, assets, compute, scoring
  lib/           # GitHub, Bedrock, Supabase
  prompts/       # Bedrock prompt builders
  data/          # Recommendations catalog
  types/
```

```bash
npm run lint
npm run build && npm start   # production build
```

---

## Rate limiting

The API applies **per-IP** limits (currently **50 requests per hour** in code; tune in `/api/analyze`). Adjust for your deployment.

---

## Security & privacy

- Inputs validated on the server  
- **No execution** of user code in analysis  
- GitHub: public API; token only if you need private repos  
- Prefer **secrets** in environment variables or your host’s secret store in production  
- Supabase: service role used server-side; enable **RLS** policies if you expose client access to `scans`  

---

## Limitations (honest scope)

- Estimates and heuristics—not a substitute for cloud billing meters or live infrastructure telemetry.  
- Best results on **public** repos without extra setup; private repos need a GitHub token.  
- Unusual architectures may not match every rule in the catalog.  

---

## License

MIT. Submitted for the **Amazon Sustainability Track** challenge context.

---

## Contributing

Pull requests welcome. Match existing patterns; add or extend **engines** and tests when you add new rules.
