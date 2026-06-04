# AI Search Visibility (GEO) Playbook — DYI Landing App

> **Status:** Active reference · **Owner:** Mani · **Last updated:** June 2026
> **Scope:** Marketing site (designyourinvention.com). Not the authenticated app.
> **Stack assumptions:** Next.js 16 static export (`output: 'export'`), React 19, Tailwind v4, next-sitemap. Served by AWS CloudFront with an S3 origin (no WAF WebACL attached).

---

## 0. Read this first — what this is and isn't

This is **brand-discoverability hygiene**, not a customer-acquisition channel. Set expectations honestly before spending a day on it:

- DYI's first customer comes through Mahesh's pharma network — a relationship/RFP/procurement sale. No patent counsel selects an IPMS from an AI "alternatives" list or a directory star-rating.
- Industry 2026 benchmarks put **AI referral traffic at roughly 1% of total web traffic.** Even when GEO works, the volume is small. For a pre-LOI product with zero customers, the near-term direct payoff is ~zero.
- **The point of doing it now** is that the high-leverage pieces are cheap, you own them, and they compound silently so the brand is correctly indexed *by the time* there's something to find. Do the cheap/owned items; defer everything gated on customers or one-shot launches.
- **Hard rule:** none of this displaces the LOI push. If a task here competes with LOI work for your attention, it loses.

**Priority order is the inverse of the typical "register on G2 first" advice.** Technical crawlability and on-page content come first because they're free, fully in your control, and everything else is inert without them.

---

## 1. Technical foundation — crawlability (mostly DONE on this stack)

If AI crawlers can't read the page, every other item is wasted effort. The good news: on this app the hardest part is already solved by the framework choice. Read §1.1 before assuming there is work here.

### 1.1 Rendering — already satisfied (no SPA problem on this app)

**This is not a Vite SPA.** The landing site is Next.js 16 with `output: 'export'` (see `next.config.ts`), which emits real static HTML for every route at build time. The headline, subhead, and feature copy are in the raw HTML, not injected client-side. There is no `react-helmet-async`, no `<div id="root">` shell, and no JavaScript-execution dependency for crawlers to read the content.

> **Note on lineage:** the original version of this section described a `react-helmet-async` SPA on S3/CloudFront. That describes a *different* DYI surface (the authenticated app and/or DYISearchBackend), not this marketing site. The SPA rendering fix does not apply here. If DYISearchBackend's public pages are still SPA-rendered, the original guidance applies *there* (see §3.1), not in this repo.

**What to actually do here:** verify, then move on.

> **Acceptance test (run once after deploy):** `curl https://designyourinvention.com/` (or View Source, not DevTools Elements) must show your real headline, subhead, and feature copy in the raw HTML. With static export this should already pass. Re-run after any change that moves content behind a `"use client"` boundary, since interactive-only content can still end up client-rendered.

### 1.2 robots.txt — explicitly allow AI crawlers (via next-sitemap, not a hand-placed file)

**Do not drop a hand-written `public/robots.txt`.** `next-sitemap` generates `robots.txt` at `postbuild` into `./out`, and a manual file would collide with it. Add the AI-crawler allowlist through `next-sitemap.config.js` `robotsTxtOptions.policies` instead. Blocking a crawler means you can't be cited by that engine.

```js
// next-sitemap.config.js
robotsTxtOptions: {
    policies: [
        { userAgent: 'GPTBot', allow: '/' },
        { userAgent: 'OAI-SearchBot', allow: '/' },
        { userAgent: 'ChatGPT-User', allow: '/' },
        { userAgent: 'ClaudeBot', allow: '/' },
        { userAgent: 'anthropic-ai', allow: '/' },
        { userAgent: 'PerplexityBot', allow: '/' },
        { userAgent: 'Google-Extended', allow: '/' },
        { userAgent: 'Applebot-Extended', allow: '/' },
        { userAgent: '*', allow: '/' },
    ],
},
```

> **No `Disallow: /app/` or `/api/` here.** The authenticated app lives on `app.designyourinvention.com` and the API on a separate origin (see CLAUDE.md "Relationship to Dashboard App"). This static marketing site has no `/app/` or `/api/` routes to exclude. `next-sitemap` appends the `Sitemap:` line automatically.

### 1.3 Host is not blocking bots (AWS CloudFront) - VERIFIED June 2026

The host is **AWS CloudFront with an S3 origin**, not Vercel or Cloudflare (an earlier draft of this doc assumed Vercel/Cloudflare from CLAUDE.md; the live deployment is CloudFront/AWS). The common 2026 gotcha is a CDN/WAF blocking AI bot user-agents by default. Checked and clear:

- **No WAF WebACL is attached** to the distribution, so no managed rules can block or rate-limit bot user-agents.
- **robots.txt explicitly allows** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, and Applebot-Extended, plus `User-agent: * Allow: /`.
- **A live user-agent probe returned HTTP 200 for every bot tested**, none blocked: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent, CCBot.

Result: this check is green. Re-run after any CloudFront behavior or WAF change.

> **Minor note (not a blocker):** some UAs (notably Applebot-Extended, Bytespider) received a smaller compressed payload (about 8.2 KB vs the 16.9 KB baseline). This is almost certainly CloudFront content-compression keying on the UA shape (browser-shaped UAs get gzip/br, raw bot tokens get identity encoding), not truncation, since every response was a clean 200 with the full HTML. To pin it down, fetch the payload with a specific UA and diff it against the baseline.

### 1.4 Sitemap + fundamentals

- Generate `sitemap.xml` listing all public marketing/content URLs; reference it in robots.txt.
- Keep the basics tight: fast load, correct 200/canonical (no stray `noindex`), mobile-clean, no redirect chains. These still drive crawlability and trust.

---

## 2. On-page content for AI extraction (DO NOW)

AI engines pull short, self-contained passages via retrieval. Write pages so any single section answers a question with verifiable facts.

### 2.1 Keyword anchors — use the exact category terms

Put these phrases explicitly in the H1/subhead and section headers (in real rendered HTML per §1.1), not buried in marketing abstraction:

- **Intellectual Property Management Software (IPMS)**
- **Patent docketing software**
- **AI patent drafting tool**
- **Prior art search**
- **Patent family tracking** (note: internal entity term is "Application Family")
- **IP management for pharma and IP boutiques**

**Replace vague copy with concrete claims.** Example pattern:

> ❌ "We optimize workflow innovation for modern IP teams."
> ✅ "Design Your Invention is an intellectual property management software (IPMS) platform for pharma companies and IP boutique law firms — multi-jurisdiction patent docketing (US, PCT, EU, JP, CN, IN), integrated prior art search, AI-assisted patent drafting, and drug/chemistry enrichment, on a compliance-ready architecture."

Lead each section with the direct answer, then context. One topic per section, clear H1→H2→H3 hierarchy.

### 2.2 Structured data (schema.org JSON-LD)

Add JSON-LD to the homepage. This is how engines map you to the IPMS category as an entity.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Design Your Invention",
  "alternateName": "DYI",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Intellectual Property Management Software",
  "operatingSystem": "Web",
  "url": "https://designyourinvention.com",
  "description": "Compliance-native, multi-tenant patent IP management software (IPMS) for pharma companies and IP boutique law firms. Multi-jurisdiction docketing, prior art search, and AI-assisted patent drafting.",
  "featureList": [
    "Multi-jurisdiction patent docketing (US, PCT, EU, JP, CN, IN)",
    "Prior art search",
    "AI-assisted patent drafting",
    "Drug and chemistry enrichment",
    "Compliance-ready architecture"
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Design Your Invention",
    "url": "https://designyourinvention.com"
  }
}
</script>
```

> **Do not add `offers`/price or `aggregateRating` yet** — you have no public price commitment and no reviews. Fabricated ratings or premature pricing is exactly the kind of claim to avoid (see §5). Add them only when real.

Also add an `Organization` block (name, url, logo, sameAs → LinkedIn) and a `FAQPage` block on the FAQ page (§2.3).

### 2.3 Build an FAQ page and a comparison page

These directly answer the questions buyers (and AIs) actually type. Plain, server-rendered text.

**FAQ page** — wrap in `FAQPage` schema. Seed questions:
- What is Design Your Invention?
- Who is DYI for? (pharma companies and IP boutique law firms)
- Which jurisdictions does DYI support?
- Does DYI do AI patent drafting? (yes — first draft for attorney review, not filing-ready)
- How does DYI handle prior art? (EPO OPS for content + Lens.org for discovery)
- Is DYI compliant? (compliance-ready architecture mirroring 21 CFR Part 11 standards — **not** "certified," see §5)

**Comparison page(s)** — "DYI vs legacy IPMS," targeting queries like *"alternatives to Clarivate / AppColl for pharma IP."* State the wedge in plain terms: multi-jurisdiction docketing + prior art + AI drafting + chemistry enrichment + modern compliance-ready architecture, in one platform. Keep it factual; don't disparage.

### 2.4 llms.txt (cheap, do it, but don't over-invest)

An `llms.txt` at the root is a curated, markdown index of your key pages for LLMs — analogous to a sitemap. Adoption is still emerging, so treat it as a low-cost bet, not a pillar.

```markdown
# Design Your Invention (DYI)

> Compliance-native, multi-tenant patent IP management software (IPMS) for pharma
> companies and IP boutique law firms. Multi-jurisdiction docketing (US/PCT/EU/JP/CN/IN),
> prior art search, AI-assisted patent drafting, and drug/chemistry enrichment.

## Core pages
- [What is DYI](https://designyourinvention.com/): Overview and category.
- [Features](https://designyourinvention.com/features): Docketing, prior art, AI drafting, chemistry.
- [DYI vs legacy IPMS](https://designyourinvention.com/compare): Positioning vs incumbents.
- [FAQ](https://designyourinvention.com/faq): Common questions.

## About
- For: pharma companies and IP boutique law firms.
- Filing focus: US / PCT first, then EU / JP / CN; India as customer geography.
```

---

## 3. Owned, compounding assets (DO NOW — worth more than directories)

### 3.1 The public patent search tool is your best SEO/GEO asset

DYISearchBackend (the public search tool) is a free public utility → organic inbound → indexable pages → lead capture. This compounds and you own it, unlike rented visibility on a directory. Make sure:
- Its public pages are crawlable (same §1.1 rendering rule applies).
- Result/landing pages have clean, indexable HTML and titles.
- Lead-gen gating stays behind the work-email step without blocking crawlers from the tool's *marketing/entry* pages.

### 3.2 Vertical long-tail content

A handful of factual articles aimed at what your buyer actually searches, each one a citable passage source:
- Section 3(d) patentability tracking for Indian pharma
- Form 27 (working statement) compliance
- ST.26 sequence listing handling in IP workflows
- US/PCT prior art search for Indian filers
- Patent family / docketing deadline management across jurisdictions

Keep a visible "Last updated" date and refresh periodically — engines weight recency.

---

## 4. Off-site presence

| Action | When | Notes |
|---|---|---|
| Founder build-in-public posts (LinkedIn, Medium) | **Now** | Best off-site item. Builds your credibility + third-party text mentions LLMs index. Keep security/RLS/DYISearchBackend internals **high-level** — build-in-public ≠ publishing your threat model. |
| Free directory profiles (G2, Capterra, AlternativeTo) | **Now, set-and-forget** | Cheap hygiene. Inert until you have reviews — don't expect anything from them yet. |
| Customer reviews (3–5 on G2/Capterra) | **Post-LOI** | The actual engine that makes directories work. Gated on pilots/LOIs by definition. |
| Legal-tech press (Artificial Lawyer, LawNext) | **Post-LOI / funding** | They cover real traction. Don't spend your "launch" news on a pre-revenue product. |
| **Product Hunt launch** | **Hold** | One good shot. Skews dev/prosumer, not pharma counsel. Don't burn it pre-LOI with no community to mobilize. |

---

## 5. Guardrails — do not over-claim (non-negotiable)

An AI scraper indexing a false claim is a liability, and a real buyer who verifies burns trust instantly.

- **Compliance framing:** "compliance-ready architecture that mirrors 21 CFR Part 11 standards." **Never** claim SOC 2 / ISO 27001 / 21 CFR Part 11 *certification* until certified. No SOC 2 badge in marketing or schema.
- **No customer logos, testimonials, named-client claims, or usage stats** until they're real.
- **No pricing or ratings in schema** until you intend them public and they're true.
- Distinguish shipped vs. planned features in copy; don't present roadmap items as live.

---

## 6. Sequencing summary

**Now (cheap, owned, compounds):**
1. Verify static-export HTML passes the source-view test (§1.1); no SPA fix needed on this app.
2. robots.txt AI-crawler allowlist via next-sitemap + sitemap; CloudFront/WAF confirmed not blocking bots (§1.2 to 1.4, verified June 2026).
3. Homepage keyword anchors + concrete copy; JSON-LD; FAQ + comparison pages (§2).
4. llms.txt (§2.4).
5. Make the public search tool crawlable; start 1–2 vertical articles (§3).
6. Founder build-in-public posts; free directory profiles set-and-forget (§4).

**Post-LOI:** reviews, press, Product Hunt.

**Never:** anything that displaces the LOI push, or any claim you can't back (§5).

---

## 7. Measurement (verify it actually worked)

- **Source-view test:** raw HTML of each marketing page shows real content (§1.1 acceptance test).
- **Bot-reach test:** AI crawler user-agents appear in the CloudFront/S3 access logs. (June 2026: a live UA probe already confirmed every AI bot gets HTTP 200, see 1.3.)
- **Citation test:** ask ChatGPT / Claude / Perplexity "tell me about Design Your Invention" and "IPMS alternatives for pharma" — check whether you're named, and whether the description is accurate. Re-run monthly.
- **Search Console:** index coverage and impressions for the target IPMS queries.
- **Reality check:** expect small absolute numbers. Success here is *accurate representation and presence*, not traffic volume — the traffic lever is the LOI-driven sales motion, not this.
