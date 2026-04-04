# Product Requirements Document (PRD)

## 1. Executive Summary

**Product Vision**
GreenDev Coach helps student developers analyze their GitHub repos and AWS deployment setups, then recommends practical changes to reduce cloud waste, lower carbon footprint, and improve efficiency.

**Target Users & Use Cases**
Primarily designed for student developers—including hackathon teams, college project groups, and student startups—as well as AWS hackathon participants. Users can input their repository URL and deployment configuration to instantly receive actionable efficiency recommendations and sustainability insights.

**Key Differentiator**
Unlike existing enterprise solutions (e.g., AWS Customer Carbon Footprint Tool, Cloud Carbon Footprint, Climatiq) that require deep billing access and lack beginner-friendly advice, GreenDev Coach is recommendation-first, student-focused, AWS-native, and uses AI not as a gimmick, but as an explainability layer.

**Success Metrics & "Winning"**
Winning means successfully enabling hackathon teams to make tangible improvements to their cloud architecture. Primary success aligns with achieving 50+ completed repo analyses during the hackathon demo period. Other key metrics include the number of recommendations acted on, improvements in sustainability scores, a total time-to-insight of under 30 seconds, and high user satisfaction as seen through shared reports.

**Strategic Alignment & Constraints**
The product aligns directly with AWS sustainability goals and typical hackathon judging criteria. It acts as an MVP built under tight constraints (48-hour sprint) by a 2-developer team, relying exclusively on an AWS-native architecture and public GitHub analysis without requiring cloud billing access.

---

## 2. Problem Statement & Opportunity

**The Problem**
Student software projects are overwhelmingly built for speed and functionality, ignoring efficiency and sustainability. Hackathon teams frequently overbuild infrastructure, leave expensive cloud resources running unnecessarily (e.g., always-on EC2 instances), run heavy CI/CD pipelines too often, and use oversized Docker images. Because student teams usually lack access to AWS billing data or enterprise sustainability tooling, they have no visibility into their actual cloud waste and carbon footprint.

**Why Existing Tools Don't Solve This**
Current tools like the AWS Customer Carbon Footprint Tool or Climatiq are geared towards enterprises, require deep billing integration, and present raw carbon metrics that are uninterpretable to beginners without contextualized recommendations on how to fix them.

**Market Opportunity**
Millions of student developers and global hackathon participants need an accessible, zero-friction sustainability coach. By providing an educational and actionable layer over code repositories, we tap into an underserved, high-growth niche of developers seeking to optimize their projects proactively.

**Success Criteria & Targets**
- **Primary:** 50+ completed repo analyses during the 48-hour hackathon.
- **Secondary:** Average sustainability score improvement delta per user, average number of recommendations generated, report export/share rate, and re-scan rate.
- **Monitoring:** API availability, latency (<30s end-to-end), error rates (<1%).

---

## 3. User Requirements & Stories

### User Personas
1. **The Hackathon Builder (Primary):** A computer science student (sophomore–senior) participating in an AWS-sponsored hackathon. Relies on AWS free tier or student credits. Understands basic cloud concepts but is ignorant of sustainability best practices. Needs extremely fast, actionable feedback.
2. **The Student Startup Founder (Secondary):** Part of a small team building an MVP or real product on a tight budget. Motivated to run lean to minimize costs and environmental impact.
3. **The Course Project Developer (Tertiary):** Building a class project deployed to AWS and wanting to export an authoritative report to impress a professor or TA with well-researched architectural decisions.

### User Journey Maps

**Current State Workflow:**
1. User builds application and pushes to GitHub.
2. User deploys app directly to AWS.
3. User has zero visibility into resource efficiency or cloud waste.
4. User inevitably over-provisions and maintains a high hidden carbon footprint.

**Ideal Future State Workflow:**
1. User enters public GitHub URL and fills out a brief deployment configuration form in GreenDev Coach.
2. GreenDev Coach fetches and conditionally analyzes project files (CI/CD, Dockerfiles, dependencies, assets).
3. The system returns a comprehensive sustainability score, top priority issues, and an effort/impact-ranked recommendation list.
4. The system provides an AI-generated, pitch-ready summary.
5. User either acts on recommendations instantly or exports a slick report for demo/judging.

### Core User Stories

**Epic: Repo Analysis**
- *As a Hackathon Builder, I want to input my public GitHub repo URL so that the system can automatically scan my project files for inefficiencies without requiring me to grant heavy permissions.* (Must Have)
  - **AC:** App accepts valid GitHub URLs. Fetches file tree under 10s.

**Epic: Deployment Configuration Input**
- *As a Hackathon Builder, I want to select my deployment environment (e.g., AWS service, instance type, serverless vs. always-on) so that recommendations are accurately tailored to my stack.* (Must Have)
  - **AC:** A multi-step form collects AWS Service, Region, Instance Type, Serverless indicator, and CI/CD setup.

**Epic: Sustainability Scoring**
- *As a Student Startup Founder, I want a simplified sustainability score so that I can easily benchmark my application's current carbon footprint readiness.* (Must Have)
  - **AC:** System generates a 0-100 score + Low/Moderate/High impact labels.

**Epic: Recommendation Engine**
- *As a Hackathon Builder, I want a ranked list of issues alongside specific code or infrastructure fixes so that I can lower my cloud waste efficiently.* (Must Have)
  - **AC:** Recommends top 3-5 issues graded by Effort and Impact, providing AWS-native alternatives.

**Epic: Before/After Comparison**
- *As a Course Project Developer, I want to visualize the before and after state of my app so that I can show my professor or a judge the exact impact of the improvements.* (Must Have)
  - **AC:** Dashboard includes a side-by-side metric panel demonstrating assumed impact when fixes are applied.

**Epic: AI Report Generation**
- *As a Hackathon Builder, I want an AI-generated summary of my sustainability profile so that I can paste a pitch-ready explanation directly into my Devpost or presentation.* (Must Have)
  - **AC:** AWS Bedrock generates separated summaries: Plain-English, Technical, Sustainability, and Pitch-Ready.

**Epic: Report Export and Sharing**
- *As a User, I want to copy a public link or download a PDF of my scan so that I can easily distribute my sustainability audit.* (Must Have)
  - **AC:** Clicking share generates an S3 pre-signed URL or a clipboard-able snapshot link.

**Epic: User Authentication**
- *As a User, I could create an account to view and analyze historical scans to track my performance across multiple projects.* (Won't Have for MVP, potential feature for v2)

---

## 4. Functional Requirements

### Feature Prioritization (MoSCoW)

**Must Have (MVP)**
- GitHub repo URL input with regex and API-level validation.
- Deployment configuration form (AWS service wrapper, region, instance dimensions, CI/CD pipeline details).
- Engine capable of checking repository structures, manifest files (package.json, requirements.txt), Dockerfiles, and GitHub Actions templates.
- Issue detection logic focusing on always-on compute limits, CI trigger frequency, bloated images, missing caching mechanisms.
- Heuristic sustainability score computation mechanism.
- Recommendation engine outputting top 3-5 issues, graded by impact and effort, proposing AWS-native replacements.
- Interactive dashboard visualizing Before/After comparison.
- AWS Bedrock powered AI summarization categorized by audience.
- Functional report copy and URL sharing.

**Should Have**
- Dynamically generated downloadable PDF report encompassing the dashboard output.
- Step-by-step implementation guide snippets per recommendation.
- Quick re-scan trigger to track progressive improvements dynamically.

**Could Have**
- User accounts tracking aggregate carbon metrics.
- Global leaderboards and digital sustainability badges.
- Built-in Slack/Discord webhook sharing.

**Won't Have (MVP Out of Scope)**
- Automated code rewriting/commits.
- Real-time live AWS billing/CloudWatch metrics integration.
- True multi-cloud (Azure/GCP) footprinting.

### Impact vs. Effort Matrix
- **High Impact, Low Effort:** Rule-based repo scanner, heuristic scoring, AI-based summaries.
- **High Impact, High Effort:** PDF Report Generation, secure deep architectural analysis.
- **Low Impact, Low Effort:** Share to social buttons.
- **Low Impact, High Effort:** Live IDE extensions, multi-cloud expansions, user authentication logic.

---

## 5. Technical Requirements

### Architecture Specification
- **Frontend Stack:** Next.js (React) + Tailwind CSS. Served via AWS Amplify or Vercel. CloudFront CDN handles fast asset delivery globally.
- **Backend Stack:** Python (FastAPI) or Node.js (Express). Hosted totally on AWS Lambda via API Gateway for a sustainable serverless approach.
- **AI Integration:** AWS Bedrock (Claude or Titan) acting as the semantic processing and copy generation layer.
- **Data & File Storage:** AWS DynamoDB for fast NoSQL scan record retrieval. AWS S3 for hosting the JSON/PDF report snapshots statically.
- **Security & Secrets:** AWS Secrets Manager orchestrates critical access tokens.

### Code Structure Rules (Strict Engineering Directives)
- **Repo Layout:** Unified Monorepo (e.g., using Turborepo) separated purely into `/frontend` and `/backend` packages.
- **Frontend File Structure:** Adhere to `/app` (pages API), `/components` (dumb UI), `/hooks` (state logic), `/lib` (external SDKs), `/types` (TS interfaces), `/styles` (globals).
- **Backend File Structure:** Organize cleanly by domain: `/routes` (API entry), `/services` (external wrappers), `/engines` (heuristic rules), `/prompts` (Bedrock templates), `/utils`, `/models`, and `/config`.
- **Modularity:** Analysis engine must distribute logic correctly. Example: logic handling CI files lives only in `ci_analysis.py`, Docker logic in `docker_analysis.py`.
- **Configuration Storage:** Recommendation database must be parsed from a structured JSON catalog or DB document, absolutley NO hardcoded string logic in analysis functions.
- **Prompts Management:** Bedrock prompt templates must live exclusively inside `/prompts`, versioned independently from business code.
- **Environment Management:** Rely on `.env` locally. Use strict AWS Secrets Manager calls in production. Never hardcode credentials.
- **API Formats:** All API route responses must serialize uniformly: `{ "success": boolean, "data": object, "error": string | null }`.
- **Code Hygiene:** Single-responsibility functions are mandatory. No function shall exceed 50 lines of code.
- **Typing:** Strict-mode TypeScript required for frontend. Python standard `typing` module type-hints required for all backend functions.
- **DOM & External Services:** No direct DOM manipulation allows safe hydration. External APIs (GitHub, Bedrock) must be mocked safely within service wrappers.

### API Requirements
- `POST /api/analyze`: Accepts `{ repoUrl, deploymentConfig }`. Returns `AnalysisResult`.
- `GET /api/report/:id`: Retrieves previously stored report document from DB.
- `POST /api/report/:id/export`: Background task triggering S3 PDF generation, yields presigned URL.

**Characteristics:**
- Authentication is bypassed for MVP but all calls enforce strict rate limiting (max 10 analysis calls per IP/hour).
- Appropriate semantic HTTP status codes are required for all paths.

### Data Models
- **ScanRequest:** `repoUrl`, `deploymentConfig(awsService, region, instanceType, isServerless, cicdSetup)`.
- **AnalysisResult:** `scanId`, `repoUrl`, `timestamp`, `sustainabilityScore(int)`, `issues[]`, `recommendations[]`, `beforeState`, `afterState`.
- **Recommendation:** `id`, `category`, `title`, `description`, `impact`, `effort`, `awsNativeAlternative`, `estimatedSavings`.
- **Report:** `scanId`, `plainEnglishSummary`, `technicalSummary`, `sustainabilitySummary`, `pitchSummary`, `generatedAt`.

### Performance Specifications
- **GitHub parsing:** Complete under 10 seconds.
- **Analysis heuristic execution:** Under 5 seconds.
- **AWS Bedrock summary:** Complete under 10 seconds.
- **Total Application SLA:** < 30 seconds total user wait time.
- **Frontend metric:** Initial paint under 2 seconds (Lighthouse ~90+).
- **Target uptime during hackathon:** 99.5%.

---

## 6. User Experience Requirements

### Design Principles
- **Action-First:** The interface should explicitly funnel users directly towards implementing optimizations.
- **Beginner-Friendly:** Abstract heavy cloud vernacular; explain metrics intuitively.
- **Demo-Ready:** The UI must appear high-fidelity and deeply polished capable of standing out during a 3-minute stage pitch.
- **Creative Directives:** Use an AWS-themed yet un-corporate approach. Lean heavily into sustainability hues (vibrant greens, muted grays, glassmorphism, subtle gradients).

### Screen-by-Screen Interfaces
1. **Landing / Home:** Bold hero statement, single input field for valid GitHub repo URL, and a high-contrast Call-to-Action button.
2. **Deployment Config Form:** A sleek wizard pattern collecting AWS service logic, region selection, compute instance details, and the pipeline setup.
3. **Scanning / Loading State:** Entertaining loading indicators displaying the background steps explicitly (“Scanning Repo…”, “Checking CI/CD…”, “Reticulating Splines…”).
4. **Results Dashboard:** Clear circular gauge emphasizing the sustainability score, grouped recommendation cards (highlighting effort/impact), and a clean before & after visualizer panel.
5. **AI Report View:** A clean horizontal tabbed interface enabling flipping between Plain English, Technical, Sustainability, and Pitch summaries.
6. **Export / Share Panel:** Sticky footer/sidebar containing easy “Copy Link” or “Download PDF” action buttons.

### Accessibility Constraints
- Ensure full WCAG 2.1 AA compliance minimum.
- 100% Keyboard navigable.
- Minimum contrast ratios verified across all text elements.
- Semantic HTML utilized alongside screen reader ARIA labels for all interactables.

### Responsive Design Requirements
- Developed desktop-first acknowledging the target coding demographic.
- Unbroken experience on tablet layouts.
- Completely readable and functional on mobile devices for casual sharing/reading.

---

## 7. Non-Functional Requirements

### Security Requirements (Strict Compliance)
- **Input Validation:** All input (Repo URIs, config elements) must be sanitized and validated server-side.
- **GitHub URL Security:** Pre-flight URL validations confirm genuine public GitHub repository locations before external SDK calls are triggered.
- **No Payload Execution:** The product performs strict read-only AST/Regex parsing of manifest files. Zero code or test scripts will be executed in the environment.
- **Public Sandbox:** Only GitHub's public API is utilized. No OAuth credentials will be requested or stored during the MVP.
- **Secrets Management:** Credentials governing Bedrock and Database layers exist strictly inside AWS Secrets Manager; committing secrets or `.env` files is a terminable offense. Add `.env.example` to the repository.
- **Logging Safety:** The backend is restricted from logging raw request payloads or potentially sensitive code snapshots to CloudWatch.
- **Throttling:** Implemented rate limiting restricts utilization to 10 requests per IP address per hour to aggressively combat abuse.
- **Transport Security:** Rigid HTTPS enforcement powered by CloudFront and ACM certificates.
- **CORS Policies:** API routes will restrict CORS solely to the recognized frontend origin header.
- **Data Access:** DynamoDB enforces a locked least-privilege IAM configuration—explicit actions only mapping to the API Gateway Lambda identity.
- **Bucket Security:** S3 reporting buckets remain strictly private. Document delivery functions exclusively through auto-expiring (1 hour TTL) pre-signed URLs.

### Reliability & Scalability
- **Environment Boot** Apply provisioned concurrency to heavy Lambdas or incorporate warm-start pings to prevent unmanageable cold starts damaging user experience.
- **DynamoDB Billing Profile:** Configure tables targeting On-Demand capability to survive hackathon presentation burst traffic flexibly.
- **CDN Strategy:** Employ extensive CloudFront caching (7-day TTL) targeting deterministic hashed static UI assets.
- **Degradation Tactics:** Implement robust service fallback loops. Assuming AWS Bedrock goes offline or times out, the backend gracefully catches the Exception and renders rule-based dashboard results sans the dynamic AI summaries rather than exploding the application.
- **System Monitoring:** Configure rigorous Amazon CloudWatch alarms firing alerts on Lambda unhandled error rates exceeding 1%, or gross latency spanning 30,000ms.

---

## 8. Success Metrics & Analytics

### Goal Posts
- **Primary KPI:** Achieving 50+ completed repository analyses representing true adoption.
- **Secondary KPIs:** Average system-generated sustainability scores, volume of high-impact recommendations served, external report URL engagement, re-scan velocities identifying active problem mitigation.

### Analytics Tracking Definitions
- Lightweight analytics pipeline mapping interaction events: `repo_submitted`, `scan_started`, `scan_completed`, `recommendation_viewed`, `report_exported`, `report_shared`, `rescan_triggered`.
- Avoid bloated tracking vendors. Utilize DynamoDB event logging endpoints or direct CloudWatch Custom Metrics arrays.
- A/B testing frameworks are strictly bypassed for the hackathon MVP but will be engineered structurally via JSON feature-flags for future integration mapping.

### Demo Validation Goal
To safely validate success prior to demo stage, the architecture must support analyzing 3 distinct real-world repositories flawlessly without latency spikes or error throws under 30 seconds globally.

---

## 9. Implementation Plan (48-Hour Sprint)

**Phase 0 — Setup (Hours 0–2):**
- Initialize Turborepo. Configure root folder structure.
- Provision base AWS account environments. Setup AWS Bedrock model accesses.
- Complete core unit testing for GitHub rate-limit queries. Structure environmental configuration files.

**Phase 1 — Core Engine (Hours 2–10):**
- Draft the primary GitHub service wrappers and the physical AST file parser logic.
- Design individual modular heuristics checks: (`ci_analysis`, `docker_analysis`, `region_analysis`, `asset_analysis`).
- Configure fixed structured recommendation catalogs locally as JSON dataframes.

**Phase 2 — Backend API (Hours 10–16):**
- Launch routing structures utilizing FastAPI or Express implementations.
- Merge the heuristic engine into AWS Bedrock API layers crafting prompt engineering structures.
- Engineer basic data models tying to live DynamoDB tables.

**Phase 3 — Frontend UI (Hours 16–28):**
- Bootstrap Next.js and integrate basic Tailwind UI structures.
- Assemble main views: Landing page layout, configuration step forms, animated loading facades, heuristic dashboards, tabbed report summaries.
- Handle endpoint connection states.

**Phase 4 — Integration & Polish (Hours 28–38):**
- Execute comprehensive End-to-End lifecycle validations targeting live test repositories.
- Apply rigorous edge-case, generic null, and error UI-state fallbacks.
- Complete 2.0 Web Accessibility audits. Confirm Lighthouse loading metrics.

**Phase 5 — Demo Preparation (Hours 38–48):**
- Lock 3 primary complex repositories for the active demo structure. Write specific presentation scripts surrounding their nuances.
- Finalize live PDF documentation triggers and active copy-sharing links.
- Apply Vercel & AWS CloudFormation deployments globally.

---

## 10. Risk Assessment & Mitigation

### Technical Risk Register

- **Risk: GitHub API Rate Limiting (429 Errors)**
  - *Probability:* High | *Impact:* High
  - *Mitigation:* Apply short-term internal Redis or memory caching targeting specific repository queries avoiding duplicate pulls. Utilize internal authenticated fallback tokens internally if volume exceeds expectations.
  - *Contingency:* Offer users the ability to provide an explicit personal access token safely via memory transmission.

- **Risk: Bedrock API Latency or Throttle Limits**
  - *Probability:* Medium | *Impact:* Medium
  - *Mitigation:* Embed strict execution timeouts protecting parent Lambdas. Apply gracefully degraded UI rendering that omits prompt outputs.
  - *Contingency:* Hardcode static pre-rendered conclusions for exact test repositories used during demo pitches.

- **Risk: Misrepresented Architectural Analysis causing false positives**
  - *Probability:* Medium | *Impact:* Medium
  - *Mitigation:* Explicit front-end disclosures indicating the tool processes "Heuristic Estimates only".
  - *Contingency:* Offer immediate "Dismiss" or "Inaccurate" vote mechanisms directly attached to recommendation cards.

### Business & Demo Risk Register

- **Risk: Hackathon Judges classify product as just "Another Carbon Meter API Wrapper."**
  - *Probability:* High | *Impact:* High
  - *Mitigation:* Emphasize the distinct nature of generating immediately executable architectural recommendations, contrasting against competitors' passive un-actionable telemetry generation.

- **Risk: Spontaneous Demo Errors during Live Stage Judging**
  - *Probability:* Medium | *Impact:* High
  - *Mitigation:* Pre-select, pre-run, and heavily cache exactly 3 target repositories specifically designed to perform under 8 seconds. Never analyze unknown participant repos live under stage pressure without caching.

- **Risk: AI Copy Generation appears hallucinatory or generic**
  - *Probability:* Low | *Impact:* High
  - *Mitigation:* The Bedrock prompt payload is explicitly restricted to referencing *only* the specific JSON outputs provided by the heuristic analysis engine, dramatically reducing generic hallucination scopes. AI summarizes, it does not detect.

---
*End of PRD*
