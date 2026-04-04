# GreenDev Coach — UI/UX Design & Build Prompt

## Overview

You are a senior product designer and frontend engineer. Build the complete UI for **GreenDev Coach** — an AI-powered sustainability analysis tool for student developers. The product analyzes a GitHub repo and AWS deployment setup, then returns a sustainability score, ranked recommendations, and a shareable AI-generated report.

The UI must be **demo-ready, polished, and student-developer friendly**. Every screen must feel intentional, fast, and credible enough to impress hackathon judges in a 3-minute live demo. No placeholder content, no generic layouts, no AI-slop aesthetics.

***

## Design Direction & Tone

**Concept:** Sustainability meets developer tooling — clean, modern, technical but approachable. Think Vercel dashboard meets a green-accented Linear.

**Tone keywords:** Precise, credible, efficient, slightly eco-warm.

**Color palette:** Dark-mode first. Use deep neutral surfaces (`#171614`, `#1c1b19`, `#201f1d`) as the primary canvas. One accent: **teal/emerald green** (`#4f98a3` dark mode, `#01696f` light mode) — used exclusively for CTAs, active states, score highlights, and key data points. One supporting warm amber/gold (`#e8af34`) for warning-level issues and medium-impact recommendations. Use `--color-error` maroon/red for high-impact issues only.

**Typography:** Load **Geist** (body, labels, code) from Vercel's CDN + **Cabinet Grotesk** (Fontshare, display headings) for section titles and the sustainability score number. These two fonts together say "serious developer tool with design sensibility."

```html
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap" rel="stylesheet">
```

**Spacing:** Dense — this is a tool, not a marketing page. Use `--space-3` to `--space-6` for component interiors, `--space-8` to `--space-12` for section gaps.

**Radius:** `--radius-md` (8px) on cards, `--radius-sm` (6px) on inputs and badges, `--radius-full` on score gauge and pills.

**Icons:** Use **Lucide Icons** via CDN for all UI icons — never emoji, never colored icon circles.

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

***

## Navigation & Global UI Rules (Non-Negotiable)

These rules apply to **every single screen** without exception. Do not wait to be told to add these — they must be present from the start:

### Global Header (Sticky, always visible)
Every screen has a fixed/sticky header at the top containing:
- **Left**: GreenDev Coach SVG logo + wordmark (custom inline SVG — a leaf merged with a terminal cursor `>_` concept)
- **Center (desktop only)**: Breadcrumb trail showing current step — e.g., `Home → Analyze → Results → Report`
- **Right**: Dark/light mode toggle icon button + (if on any page past Home) a **"Start New Scan" ghost button** that always takes the user back to the home/input screen
- The header must use `position: sticky; top: 0; z-index: 50` with a subtle `backdrop-filter: blur(12px)` and a 1px bottom border using `oklch(from var(--color-text) l c h / 0.08)`

### Back Button
- **Every screen except Home** must have a clearly visible **"← Back" button** in the top-left area below the header (not inside it)
- Style: ghost button, `--color-text-muted`, with a left-arrow Lucide icon (`<i data-lucide="arrow-left"></i>`)
- The back button must navigate to the logically previous screen in the flow: Results → Form → Home
- On mobile, the back button must be at least 44×44px tap target

### Home Button
- The **GreenDev Coach logo/wordmark in the header is always a clickable home link** — clicking it returns the user to the Home screen from anywhere
- Additionally, on screens 3+ deep in the flow (Results, Report), show a **"← Start Over"** text link (not button) below the back button, styled in `--color-text-faint`, that resets all state and goes to Home

### Progress Indicator
- On the **Form screen** and **Scanning screen**, show a step progress bar at the top of the page body (below the header) with 4 labeled steps:
  1. `Enter Repo`
  2. `Configure Deployment`
  3. `Analyzing`
  4. `Results`
- Use a segmented horizontal bar with filled teal segments for completed steps, a pulsing teal segment for the current step, and gray segments for upcoming steps
- Each step label is visible — not just dots

### Breadcrumb
- Shown in the header on desktop (≥768px)
- Hidden on mobile (replaced by the back button)
- Format: `Home / Analyze / Results` — use `>` as separator, current page in `--color-text`, previous pages in `--color-text-muted` and clickable

### Keyboard Navigation
- `Escape` key on any overlay, modal, or detail panel closes it and returns focus to the triggering element
- `Enter` on the repo URL input submits the form
- All interactive elements must be Tab-navigable with visible `:focus-visible` outlines in teal

### Error & Loading States (Every Screen)
- Every screen that loads data must have a **skeleton loading state** that mirrors the real layout — no blank white screens, no spinners alone
- Every API error must show an **inline error state** with: error icon, plain-English explanation, and a "Try Again" button — never a raw error message
- Empty states (no recommendations found) must show a warm message + illustration + action

***

## Screen-by-Screen Specifications

### Screen 1: Home / Landing

**Purpose:** First impression, repo URL input, CTA. Must work as a standalone demo in 30 seconds.

**Layout:** Single column, vertically centered on desktop. No sidebar. Full-height viewport section.

**Elements (top to bottom):**
1. **Global sticky header** (logo + dark mode toggle — no breadcrumb on Home, no "Start New Scan" button)
2. **Hero section:**
   - Tag line badge: small pill chip — `<leaf icon> Sustainability for Student Devs` — teal background, teal text, `--radius-full`
   - H1 heading: "**Is your project as green as your code is good?**" — Cabinet Grotesk 700, `--text-2xl`, left-aligned on desktop
   - Subtext (1 sentence): "Paste your GitHub repo URL. GreenDev Coach analyzes your code and AWS setup, then tells you exactly how to reduce cloud waste and carbon footprint." — `--text-base`, `--color-text-muted`, max-width 55ch
3. **Repo URL input form (the CTA):**
   - A large, prominent input field: placeholder `https://github.com/username/repo` — full width on mobile, 600px max on desktop
   - Inline validation: on blur, check URL format; show green checkmark if valid, red error if not
   - Below input: small helper text — `<lock icon> Public repos only. No code is executed.` — `--text-xs`, `--color-text-faint`
   - **"Analyze Repo →" primary button** — right of input on desktop, full-width below on mobile — solid teal background, white text, `--radius-md`, 44px height minimum
4. **Social proof strip** (3 items in a row, subtle): `<zap icon> Avg scan: 18 seconds` · `<github icon> Public repos only` · `<shield icon> Read-only access`
5. **How it works (3 steps, below the fold):** Simple numbered list, left-aligned — Step 1: Paste repo URL → Step 2: Configure your deployment → Step 3: Get your sustainability score + fixes
6. **Footer:** Minimal — "Built at ASU Hackathon 2026" + GitHub link

**Navigation on this screen:**
- No back button (this is Home)
- Logo is not a link (already home)
- Pressing Enter in the input submits the form
- Successful URL validation + submit → navigate to Screen 2 (Form)

***

### Screen 2: Deployment Configuration Form

**Purpose:** Collect AWS deployment details before analysis. Must feel fast and simple — not like a long form.

**Layout:** Two-column on desktop (form left, context/tips right), single column on mobile.

**Navigation elements (mandatory):**
- **Global sticky header** with breadcrumb: `Home / Analyze` + "Start New Scan" ghost button top-right
- **"← Back" button** below header, left-aligned — returns to Screen 1 (Home), preserves the repo URL in state so user doesn't have to re-enter it

**Form structure — use a 2-step inline wizard, not one long form:**

**Step 1 of 2 — Deployment Setup:**
- Field: "Which AWS service are you deploying to?" — segmented control / button group with icons:
  - `EC2` · `Lambda` · `ECS/Fargate` · `Elastic Beanstalk` · `Amplify` · `Other`
  - Selected option gets teal border + teal background tint
- Field: "AWS Region" — searchable dropdown with region names AND codes (e.g., "US East (N. Virginia) — us-east-1")
- Toggle: "Is your compute always-on (24/7) or event-driven?" — two-option toggle: `Always-on` | `Event-driven (Serverless)`
- Field: "Approximate instance type" — text input with placeholder `e.g., t3.micro, m5.large` — `--text-sm`, monospace font for the input

**Step 2 of 2 — CI/CD & Extras:**
- Field: "What CI/CD tool do you use?" — segmented control: `GitHub Actions` · `CircleCI` · `Jenkins` · `None` · `Other`
- Field: "How often does your pipeline run?" — dropdown: `On every push` · `On PR only` · `Scheduled (nightly)` · `Manually`
- Toggle: "Do you have caching configured in your pipeline?" — Yes / No toggle
- Field: "Frontend framework (optional)" — dropdown: `React` · `Next.js` · `Vue` · `Svelte` · `None/Backend only`

**Step navigation within the form:**
- Step 1 has a **"Next: CI/CD Details →"** primary button (full width on mobile, right-aligned on desktop)
- Step 2 has a **"← Back to Deployment"** ghost button (left) AND **"Analyze My Repo →"** primary button (right)
- Progress between step 1 and step 2 is shown in the step indicator at top (segment 2 fills in as user moves to step 2)
- Submitting Step 2 → navigate to Screen 3 (Scanning)

**Right panel (desktop only, sticky):**
- Card titled "Why we ask this" — 3–4 bullet points explaining why deployment info matters for sustainability scoring
- Below it: a "Quick tip" card that updates based on which AWS service the user selected (e.g., if EC2 selected, show: "EC2 instances running 24/7 are one of the biggest sources of cloud waste for student projects")

***

### Screen 3: Scanning / Analysis in Progress

**Purpose:** Keep user engaged while the backend processes. Must look impressive in a live demo.

**Layout:** Full-page centered content, no sidebar.

**Navigation elements (mandatory):**
- **Global sticky header** with breadcrumb: `Home / Analyze / Scanning` + "Start New Scan" ghost button
- **No back button** on this screen — the scan is in progress. Instead, show a subtle **"Cancel scan"** text link in `--color-text-faint` that, if clicked, shows a confirmation modal: "Cancel this scan? Your results will be lost." with "Yes, cancel" (returns to Home) and "Keep waiting" (dismisses modal)
- The cancel confirmation modal must have: title, body text, two buttons, and an **✕ close button** top-right of the modal

**Content:**
1. Repo URL shown at top in a subtle card: `<github icon> github.com/username/repo` — `--color-text-muted`, monospace
2. **Animated step list** — vertical list of analysis steps, each with an icon and label. Steps animate in sequentially:
   - `<cloud-download icon>` Fetching repository structure... → ✓ Done
   - `<git-branch icon>` Analyzing CI/CD pipelines... → ✓ Done
   - `<box icon>` Checking Docker & container config... → ✓ Done
   - `<globe icon>` Evaluating region & compute choices... → ✓ Done
   - `<cpu icon>` Scoring sustainability factors... → ✓ Done
   - `<sparkles icon>` Generating AI recommendations... → (pulsing, in progress)
   - Each completed step: teal checkmark, text goes from `--color-text-muted` to `--color-text`
   - Current step: animated teal spinner, label in `--color-text`
   - Upcoming steps: `--color-text-faint`
3. **Estimated time remaining** — "~12 seconds remaining" counting down, `--text-sm`, `--color-text-muted`
4. **Fun sustainability fact** — rotating every 4 seconds at the bottom: "Did you know? Always-on t3.micro instances emit ~0.8kg CO₂/month — about the same as charging 100 smartphones." — italic, `--color-text-faint`, `--text-sm`

**On completion:** Auto-navigate to Screen 4 (Results Dashboard) with a smooth fade transition — no click required.

***

### Screen 4: Results Dashboard

**Purpose:** The core value screen. Show the sustainability score, top issues, and recommendations. Must be scannable in 10 seconds.

**Layout:** Two-column on desktop (score + issues left, recommendations right), stacked single column on mobile.

**Navigation elements (mandatory):**
- **Global sticky header** with breadcrumb: `Home / Analyze / Results` + "Start New Scan" ghost button
- **"← Back to Config"** ghost button below header — returns to Screen 2 (Form) with all form values preserved — the user should NOT have to re-fill the form
- **"← Start Over"** faint text link below the back button — resets all state, returns to Screen 1 (Home)
- **"View Full Report →"** primary button (sticky on mobile — fixed at bottom of viewport) that navigates to Screen 5

**Left column — Score & Issues:**

1. **Sustainability Score Card** — the hero element of this screen:
   - Large circular gauge (SVG arc) showing score 0–100
   - Score number in Cabinet Grotesk 800, `--text-hero` size, colored based on score:
     - 70–100: teal `--color-primary`
     - 40–69: amber `--color-gold`
     - 0–39: red `--color-error`
   - Label below number: "Sustainability Score" in `--text-sm`, `--color-text-muted`
   - Below gauge: score tier badge pill — e.g., `Moderate Impact` or `High Impact` or `Low Impact` — colored accordingly
   - Subtext: "Based on X factors analyzed across your repo and deployment config"

2. **Top Issues List** — "What we found" section:
   - Max 5 issues, each in a row card:
     - Left: impact badge (`HIGH` / `MED` / `LOW`) — colored pill
     - Center: issue title + one-line description
     - Right: `<chevron-right icon>` — clicking the row expands an inline detail panel below it (accordion, not modal) showing: full explanation, affected files (if applicable), estimated monthly CO₂ or cost impact
   - Each accordion panel has a **"← Close"** text link at the bottom to collapse it

**Right column — Recommendations:**

3. **Recommendations Section** — "How to fix it":
   - Up to 5 recommendation cards, sorted by impact (highest first)
   - Each card contains:
     - **Header row:** Title + two badges: `Impact: HIGH/MED/LOW` + `Effort: HIGH/MED/LOW` (different colors for each badge type)
     - **Body:** 2–3 sentence plain English description of the fix
     - **AWS alternative callout:** Small teal-tinted box: `<aws icon> AWS Alternative: Use Lambda instead of always-on EC2` — monospace font, subtle border
     - **Estimated savings:** `~$4.20/month · ~1.2kg CO₂/month saved`
     - **"See implementation guide"** expandable section — clicking shows a code snippet or step-by-step instructions inline. Has a **"← Collapse"** link to close it.
   - Cards are visually sorted — high impact cards have a slightly more prominent border or teal left accent (use a teal dot, not a thick border stripe)

4. **Before / After Comparison Panel:**
   - Side-by-side two-column layout (or stacked on mobile with a toggle "Before" / "After" tab switcher)
   - Left (Before): repo stats as-is — estimated monthly cost, CO₂, CI/CD runs/month, compute hours
   - Right (After): projected stats if all recommendations are applied — show delta values in green with up/down arrows
   - Formatted as: a small stats table, not a chart — clean numbers, `tabular-nums`, `--font-mono`

**Mobile behavior:**
- Score card is full-width at top
- Issues list below, collapsed by default (show first 2, "Show all X issues" expand link)
- Recommendations below that, in full-width cards
- Before/After uses tab switcher
- **Sticky bottom action bar** (fixed, 64px height): "View Full AI Report →" primary teal button + "Share Results" ghost button — floats above page content with a subtle top shadow

***

### Screen 5: AI Report View

**Purpose:** Display the AI-generated report in 4 formats. Enable sharing and export.

**Layout:** Single column, centered, `--content-narrow` (640px) max-width — reading-optimized.

**Navigation elements (mandatory):**
- **Global sticky header** with breadcrumb: `Home / Analyze / Results / Report` + "Start New Scan" ghost button
- **"← Back to Results"** ghost button below header — returns to Screen 4 (Results Dashboard), preserves all data
- **"← Start Over"** faint text link below back button

**Content:**

1. **Tab bar** — 4 tabs in a horizontal tab strip:
   - `Plain English` · `Technical` · `Sustainability` · `Pitch-Ready`
   - Active tab: teal underline + `--color-text`; inactive: `--color-text-muted`
   - Switching tabs is instant (no load) — all 4 report variants are pre-generated and stored in state
   - On mobile: tabs become a horizontal scrollable strip (no wrapping)

2. **Report body** — changes per tab:
   - Rendered as formatted markdown-to-HTML: headings (`--text-lg`, `--text-base`), paragraphs (`--text-base`, 65ch max-width), bullet lists, code blocks in monospace with a dark surface background
   - Sections within each report are collapsible via `<details>/<summary>` — each section starts expanded

3. **Action bar** (below report, sticky on mobile):
   - `<copy icon> Copy Link` — copies a shareable URL or JSON blob URL to clipboard; shows "Copied!" toast for 2 seconds
   - `<download icon> Download PDF` — triggers PDF generation and downloads; shows loading spinner in button while generating
   - `<share-2 icon> Share` — on mobile, opens the native Web Share API; on desktop, opens a small popover with: copy link, Twitter/X share text, LinkedIn share text
   - All three actions are in a row of ghost buttons with icons — equal visual weight

4. **Scan metadata footer** — subtle, at very bottom:
   - `Scanned: github.com/user/repo · April 4, 2026 · GreenDev Coach`
   - `--text-xs`, `--color-text-faint`

***

## Component Library (Build These Once, Reuse Everywhere)

Build these as reusable HTML/CSS/JS components. Every component must work in both light and dark mode.

### Buttons
```
Primary:    solid teal bg, white text, --radius-md, 44px min-height, hover: darken 10%, active: scale(0.98)
Secondary:  teal border + teal text, transparent bg, hover: teal bg at 10% opacity
Ghost:      no border, --color-text-muted text, hover: --color-surface-2 bg
Danger:     --color-error bg on hover only (start as ghost), for destructive actions
Icon-only:  44x44px, ghost style, always has aria-label, shows tooltip on hover (desktop)
```
All buttons: `transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1)` · `cursor: pointer` · disabled state: 40% opacity + `cursor: not-allowed`

### Input Fields
- Height: 44px · `--radius-md` · border: `1px solid var(--color-border)` · focus: teal 2px outline offset 2px
- Error state: red border + red helper text below
- Success state: green checkmark icon inside right of input
- All inputs have visible `<label>` above them — never placeholder-only labels
- Helper text below input in `--text-xs`, `--color-text-muted`

### Cards
- Background: `--color-surface` · border: `1px solid oklch(from var(--color-text) l c h / 0.08)` · `--radius-lg` · `--shadow-sm`
- Hover (interactive cards only): `--shadow-md`, border slightly darker
- Never use colored left-border stripe — use a colored dot, badge, or background tint instead

### Badges / Pills
- `--radius-full` · `--text-xs` · `font-weight: 600` · uppercase tracked (`letter-spacing: 0.05em`)
- Impact HIGH: error-highlight bg + error text
- Impact MED: gold-highlight bg + gold text  
- Impact LOW: success-highlight bg + success text
- Neutral: surface-offset bg + text-muted text

### Toast Notifications
- Fixed bottom-right (bottom-center on mobile) · `--shadow-lg` · `--radius-md`
- Auto-dismiss after 3 seconds with a progress bar shrinking at the bottom
- Types: success (teal), warning (amber), error (red)
- Must have an ✕ dismiss button

### Modals / Overlays
- **Every modal must have:**
  - A clear title in `--text-lg`
  - An **✕ close button** in the top-right corner (44×44px tap target)
  - A "Cancel" or "← Back" text button in the footer
  - Backdrop: `rgba(0,0,0,0.6)` with `backdrop-filter: blur(4px)`
  - Opens with: fade-in + scale from 0.95 to 1 (120ms)
  - Closes with: fade-out + scale to 0.95 (100ms)
  - `Escape` key closes it
  - Focus trapped inside while open

### Accordion / Expandable Rows
- Uses `<details>/<summary>` or CSS max-height transition
- Chevron icon rotates 180° when open
- Expanded area slides open: `max-height` transition, 200ms ease-out
- **Every expandable section has a visible "close" affordance** — either a "← Collapse" text link at the bottom of the expanded content, or the summary row is re-clickable to collapse (clearly indicated by a "Click to collapse" aria-label)

***

## Responsive Design Rules

### Breakpoints
- Mobile: 375px (design here first)
- Tablet: 768px
- Desktop: 1024px+

### Mobile-Specific Rules
- Every screen: single column, full-width cards
- Results screen: sticky bottom action bar with primary CTA always visible
- Form screen: each step is full-width, inputs are full-width
- Tabs (Report screen): horizontally scrollable, no wrapping
- Header: logo only (no breadcrumb) + hamburger menu (if needed) or just logo + dark mode toggle
- All touch targets: minimum 44×44px — add padding to achieve this, never shrink the visual
- Body text: minimum `--text-base` (16px) everywhere — prevents iOS auto-zoom on input focus
- No hover-dependent UI — all tooltips/popovers must also work on tap

### Navigation on Mobile
- Back button: always visible, full-width tap area, left-aligned with icon + text
- "Start Over" link: visible below back button, `--text-sm`
- Step progress indicator: shown above form content, compact version (dots + active label only)
- Sticky bottom bars: 64px height, full width, 1px top border, `--color-bg` background with slight blur

***

## Accessibility Requirements

- One `<h1>` per screen — the page title
- Heading hierarchy: h1 → h2 → h3, never skip
- All icon-only buttons: `aria-label` + Lucide `title` attribute
- All images: `alt` attribute
- Color is never the ONLY way to convey information — always pair with text or icon
- Score gauge: `role="meter"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Sustainability Score: 67 out of 100"`
- Tab navigation: all interactive elements reachable via Tab in logical order
- Skip link: `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>` as first focusable element
- Form inputs: all have associated `<label>`, error messages linked via `aria-describedby`
- Modals: focus trapped, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title

***

## Performance Rules

- Fonts: preconnect + `display=swap`
- All images: `loading="lazy"`, `width`/`height` set, `decoding="async"`
- No page should have a blank flash — use skeleton loaders for any async data
- JS: `defer` or `type="module"` on all script tags
- Transitions: hardware-accelerated only (`transform`, `opacity`) — never animate `height`, `width`, `top`, `left`
- Target: page interactive in under 2 seconds

***

## Anti-Patterns — Do NOT Include

- No gradient buttons (solid teal only)
- No colored left-border card stripes
- No icons inside colored circles as feature decorators
- No purple/violet anywhere — this is a teal + neutral palette
- No centered body text (hero headings only center-aligned)
- No emoji as UI elements
- No generic hero copy like "Empowering your sustainability journey"
- No unstyled loading states — every async action has a skeleton or spinner
- No modals without ✕ close buttons
- No expandable sections without a visible "collapse" affordance
- No form fields without visible labels
- No screen transitions that feel like a hard page reload — use fade or slide transitions between screens

***

**Deliver:** A single `greendev-coach.html` file with all screens implemented using in-page hash routing (`#home`, `#configure`, `#scanning`, `#results`, `#report`), with smooth fade transitions between views. All state managed in JavaScript variables. Dark mode as default with a light mode toggle. No external backend calls required — use realistic hardcoded mock data for the scan results so the demo works end-to-end without an API.
