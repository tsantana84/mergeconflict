# Merge Conflict Blog — Design Spec

## Overview

Personal blog at **mergeconflict.space** exploring the tension between being an engineering manager and still writing code, and how AI contributes to both sides. Built with Next.js, MDX, and deployed on Vercel.

## Core Identity

- **Name**: Merge Conflict
- **Tagline concept**: The tension between the manager branch and the engineer branch
- **Audience**: Engineering managers, senior engineers, tech leads — people who live in both worlds
- **Tone**: Opinionated, personal, technically grounded
- **Content format**: Essays, reflections, technical deep dives — text-first

## Visual Direction

**Style**: Modern & Bold — dark background, heavy typography, vibrant gradient accents, high contrast, strong personality.

**Color Palette**:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Surface | `#18181b` | Cards, code blocks, elevated elements |
| Border | `#27272a` | Separators, card borders |
| Text Primary | `#fafafa` | Headings, primary content |
| Text Secondary | `#a1a1aa` | Body text, paragraphs |
| Text Muted | `#71717a` | Meta info, dates, captions |
| Accent Start | `#f97316` | Gradient start (orange) |
| Accent End | `#ec4899` | Gradient end (pink) |
| Accent Solid | `#f97316` | Links, hover states |

**Typography**:

| Element | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| Headings | Space Grotesk | 700-800 | 24-48px | letter-spacing: -0.05em |
| Body | DM Sans | 400 | 18px | line-height: 1.75, max-width: 680px |
| Code | JetBrains Mono | 400 | 14px | Syntax-highlighted code blocks |
| Logo | Space Grotesk | 800 | — | "MERGE" white + "CONFLICT" gradient |
| Meta | DM Sans | 400 | 14px | Color muted |

**Effects**:
- Hover on cards: color shift, 200-300ms transition (no scale to avoid layout shift)
- Section gaps: 48px+
- CTA buttons: gradient background (orange→pink), black text, border-radius 8px
- Code blocks: surface background, border, dark syntax theme
- Tag badges: transparent background, colored border, pill shape

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js (App Router) | User expertise, flexibility |
| Content | MDX files in repo | Git-driven, versionable, no external CMS |
| MDX Rendering | next-mdx-remote | Parse and render MDX with custom components |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Deploy | Vercel | Native Next.js integration, zero config |
| Content organization | Tags (free-form) | Flexible, scales well |

## Project Structure

```
merge-conflict/
├── app/
│   ├── layout.tsx              # Root layout: fonts, theme, Header, Footer
│   ├── page.tsx                # Home: featured post + post grid
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx        # Individual post
│   └── tags/
│       ├── page.tsx            # All tags with post counts
│       └── [tag]/
│           └── page.tsx        # Posts filtered by tag
├── content/
│   └── posts/                  # MDX files
│       └── *.mdx
├── components/
│   ├── Header.tsx              # Nav: logo + links
│   ├── Footer.tsx              # Footer: newsletter CTA + social links
│   ├── PostCard.tsx            # Post card for grids (home, tag pages)
│   ├── PostLayout.tsx          # Post page wrapper (title, meta, tags, content)
│   ├── TagBadge.tsx            # Tag pill component
│   ├── NewsletterForm.tsx      # Email signup form (reusable)
│   └── MDXComponents.tsx       # Custom MDX renderers (code, callout, blockquote)
├── lib/
│   ├── posts.ts                # getAllPosts, getPostBySlug, getPostsByTag, getAllTags
│   ├── mdx.ts                  # MDX parse/render utilities
│   └── analytics.ts            # GA4 gtag helper + custom event functions
├── public/
│   └── images/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Pages

### Home (`/`)
- Header with logo and nav (Posts, About, Newsletter)
- Featured post: latest post displayed large (title, excerpt, tags, CTA)
- Post grid: remaining posts as cards (title, excerpt, tags, date, reading time)
- Footer with newsletter CTA and social links

### Post (`/blog/[slug]`)
- Header
- Tag badges + H1 title (Space Grotesk 48px) + meta (date, reading time)
- MDX content rendered at 680px max-width, centered
- Custom MDX components: syntax-highlighted code blocks, callouts, styled blockquotes
- Post footer: tags, previous/next post links
- Inline newsletter CTA at end of post
- Footer

### About (`/about`)
- Same reading layout as post (680px centered)
- Free-form content about the author, the blog, the "merge conflict"

### Tags (`/tags`)
- All tags listed as clickable pills with post count

### Tag Page (`/tags/[tag]`)
- Tag name as title + post grid filtered by tag (same card component as home)

## MDX Frontmatter Schema

```yaml
---
title: string        # Post title
date: string         # ISO date (YYYY-MM-DD)
tags: string[]       # Free-form tag list
excerpt: string      # Short description for cards and SEO
---
```

## Content Utilities (`lib/posts.ts`)

- `getAllPosts()`: Read all MDX files from `content/posts/`, parse frontmatter, sort by date desc. Computes `readingTime` from word count (~200 wpm).
- `getPostBySlug(slug)`: Read and parse single post by filename
- `getPostsByTag(tag)`: Filter posts by tag
- `getAllTags()`: Extract unique tags with post counts

All functions run at build time (static generation).

## Analytics (Google Analytics 4)

Metrics from day zero. GA4 via `gtag.js` loaded in root layout.

**Traffic & Audience (built-in GA4):**
- Pageviews (total and per post)
- Unique visitors
- Sessions and average duration
- Bounce rate
- Traffic source breakdown (direct, social, search, newsletter)

**Content & Engagement (custom events):**
- `post_read` — fired when user reaches 75% scroll depth on a post
- `scroll_depth` — tracked at 25%, 50%, 75%, 100% milestones
- `newsletter_cta_view` — fired when newsletter form enters viewport
- `newsletter_cta_click` — fired when user focuses the email input
- `newsletter_signup` — fired on form submit

**SEO (via Google Search Console, linked to GA4):**
- Search queries driving traffic
- Average position per post
- Core Web Vitals (LCP, INP, CLS)

**Implementation:**
- `GA_MEASUREMENT_ID` in environment variable
- Script loaded conditionally (skip in dev)
- Custom events fired via `gtag('event', ...)` helper in `lib/analytics.ts`
- Scroll depth tracking via Intersection Observer on post pages
- Newsletter funnel: view → click → signup tracked as custom events

## SEO & Metadata

- Use Next.js `generateMetadata` in each page/layout for `<title>`, `<meta description>`, Open Graph tags
- Post pages: title from frontmatter, description from excerpt, og:type article
- Home/Tags/About: static metadata
- Canonical URLs with `mergeconflict.space` domain

## Accessibility Requirements

- Color contrast minimum 4.5:1 for all text
- Skip-to-content link for keyboard navigation
- `prefers-reduced-motion` media query for animations
- Proper `<label>` elements on newsletter form inputs
- Sequential heading hierarchy (h1 → h2 → h3)
- Alt text on all meaningful images
- `aria-label` on icon-only interactive elements
- Tab order matches visual order

## Newsletter Integration

Newsletter signup is a component (`NewsletterForm.tsx`) used in:
- Footer (persistent across all pages)
- Inline at the end of each blog post

Integration with the actual newsletter service will be added later. For v1, the form collects email and shows an inline success message replacing the form ("Thanks! You'll hear from us soon.").

## Future Considerations (not in v1)

- Search functionality
- RSS feed
- Reading progress bar
- Dark/light mode toggle (currently dark-only)
- Newsletter backend integration
- Social share buttons
- Related posts
