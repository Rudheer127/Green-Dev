# 🌿 GreenDev Coach

> A project-level sustainability advisor for developers. Analyze your GitHub repository, evaluate your AWS deployment choices, and get AI-powered recommendations to reduce your carbon footprint and monthly bill.

## 🚀 Track Alignment: Amazon Sustainability
GreenDev Coach solves the **Track: Sustainability** challenge by enabling developers to build, run, and scale their projects more efficiently. It bridges the gap between architectural decisions and environmental impact.

---

## ✨ Features
1.  **Infrastructure Analysis**: We detect Docker/CI/CD patterns and compare your AWS choices (EC2, Lambda, S3) with greener alternatives.
2.  **Carbon Quantification**: Get estimated CO₂ and cost savings based on real usage patterns extracted from your repository.
3.  **AI Sustainability Reports**: Four distinct report formats (Plain English, Technical, Pitch-Ready) to help communicate impact to all stakeholders.
4.  **Actionable Implementation**: We don't just tell you what's wrong; we provide step-by-step implementation guides.
5.  **Carbon-Aware Regions**: Automatically identifies the "greenest" AWS regions (Oregon, Ireland, Stockholm) for your projects.

---

## 🛠️ Setup & Installation

### Prerequisites
-   **Node.js 18+**
-   **AWS Account**: Required for Bedrock (Claude 3.5 Sonnet access)
-   **Supabase Account**: Required for database persistence and rate limiting

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/greendev-coach.git
cd greendev-coach
```

### 2. Configure Environment
Create a `.env.local` file in the root directory (refer to `.env.example`).

```bash
# AWS Keys (Required for Bedrock AI)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# GitHub Token (Optional for public, Required for private)
GITHUB_TOKEN=...

# Supabase Keys (Required for persistence)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. Initialize Database
Go to your Supabase SQL Editor and run the contents of `supabase.sql` to create the `scans` and `rate_limits` tables.

### 4. Run Development Server
```bash
npm install
npm run dev
```

---

## 🏗️ Architecture
-   **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion, Radix UI.
-   **Analysis Engines**: Modular TypeScript engines that parse Dockerfiles, YAML workflows, and package metadata.
-   **AI Stack**: AWS Bedrock (Anthropic Claude 3.5 Sonnet) for intelligent report generation.
-   **Backend**: Supabase (PostgreSQL) for persistence and infrastructure monitoring.

---

## 🌱 Sustainable Engineering
-   **Region Awareness**: Promotes Stockholm, Ireland, and Oregon for their high renewable energy grid percentage.
-   **Compute Optimization**: Prioritizes Serverless/Fargate workflows over idle EC2 instance configurations.
-   **CI Efficiency**: Recommends dependency caching and PR-only triggers to reduce wasted CI compute energy.

---

## 📝 License
MIT License. Created for the **Amazon Sustainability Track Hackathon**.
