# Merge Conflict Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visually bold, dark-themed personal blog at mergeconflict.space with Next.js, MDX content, GA4 analytics, and newsletter signup.

**Architecture:** Next.js App Router with static generation. MDX files in `content/posts/` parsed at build time. Tailwind CSS for styling. GA4 for analytics with custom events. No external CMS or database.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, next-mdx-remote, gray-matter, rehype-pretty-code, shiki, Google Analytics 4

**Spec:** `docs/superpowers/specs/2026-03-22-merge-conflict-blog-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout: fonts, theme, `<html>` wrapper, Header, Footer, GA script |
| `app/page.tsx` | Home: featured post + post grid |
| `app/about/page.tsx` | About page |
| `app/blog/[slug]/page.tsx` | Individual post with MDX rendering |
| `app/tags/page.tsx` | All tags listing |
| `app/tags/[tag]/page.tsx` | Posts filtered by tag |
| `app/globals.css` | Tailwind imports + custom prose styles |
| `content/posts/hello-world.mdx` | Seed post for development and testing |
| `components/Header.tsx` | Logo + nav links |
| `components/Footer.tsx` | Newsletter CTA + social links |
| `components/PostCard.tsx` | Post card for grids |
| `components/TagBadge.tsx` | Tag pill component |
| `components/NewsletterForm.tsx` | Email signup with inline success state |
| `components/MDXComponents.tsx` | Custom MDX renderers |
| `components/ScrollDepthTracker.tsx` | Client component for scroll analytics |
| `components/GoogleAnalytics.tsx` | Client component for GA4 script |
| `lib/posts.ts` | Content utilities: getAllPosts, getPostBySlug, getAdjacentPosts, etc. |
| `lib/mdx.ts` | MDX compilation with rehype-pretty-code |
| `lib/analytics.ts` | GA4 event helper functions |
| `next.config.ts` | Next.js config |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/thiagosantana/projects/merge-conflict
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=false --import-alias "@/*" --use-npm
```

Accept defaults. This creates the base Next.js project with App Router and Tailwind.

- [ ] **Step 2: Install content dependencies**

```bash
npm install next-mdx-remote gray-matter reading-time rehype-pretty-code shiki
```

- [ ] **Step 3: Delete `tailwind.config.ts` and set up globals.css**

Tailwind v4 uses CSS-based configuration via `@theme`, not a JS config file. Delete the generated `tailwind.config.ts`:

```bash
rm tailwind.config.ts
```

Replace `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-background: #0a0a0a;
  --color-surface: #18181b;
  --color-border: #27272a;
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-accent-orange: #f97316;
  --color-accent-pink: #ec4899;
  --font-heading: var(--font-space-grotesk), sans-serif;
  --font-body: var(--font-dm-sans), sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}

::selection {
  background-color: #f9731644;
  color: #fafafa;
}
```

- [ ] **Step 5: Set up root layout with fonts**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Merge Conflict",
    template: "%s | Merge Conflict",
  },
  description:
    "The tension between being an engineering manager and still writing code. AI, leadership, and engineering.",
  metadataBase: new URL("https://mergeconflict.space"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-text-secondary antialiased">
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder home page**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="font-heading text-5xl font-extrabold tracking-tight text-text-primary">
        MERGE
        <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
          CONFLICT
        </span>
      </h1>
    </div>
  );
}
```

- [ ] **Step 7: Verify dev server runs**

```bash
npm run dev
```

Open `http://localhost:3000`. Expect: dark background with "MERGECONFLICT" logo centered, gradient applied to "CONFLICT".

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind theme and fonts"
```

---

### Task 2: Content Layer (`lib/posts.ts` + `lib/mdx.ts`)

**Files:**
- Create: `lib/posts.ts`, `lib/mdx.ts`, `content/posts/hello-world.mdx`

- [ ] **Step 1: Create seed MDX post**

Create `content/posts/hello-world.mdx`:

```mdx
---
title: "The Manager Who Still Writes Code"
date: "2026-03-22"
tags: ["ai", "management", "engineering"]
excerpt: "There's a quiet tension in every engineering manager's day. The pull request you want to review versus the 1:1 you need to prepare for."
---

There's a quiet tension in every engineering manager's day. You open Slack and there's a pull request you're dying to review — a gnarly concurrency bug that your past self would've loved to sink into for hours.

But then there's the 1:1 with a report who's been struggling. The sprint retro you haven't prepped for. The hiring pipeline that needs attention.

## Where AI Enters the Picture

I started using Claude to draft my retro summaries. Not the observations — those are mine — but the structure, the framing. It saved me 30 minutes every two weeks.

```typescript
const role = getRole(me);
if (role === 'manager' && stillLovesCode) {
  // this is the merge conflict
  return 'embrace the tension';
}
```

The merge conflict isn't a bug. It's a feature.

## The Resolution

You don't have to pick a branch. The best engineering managers I know are the ones who stay close to the code — not writing features, but understanding the system deeply enough to make better decisions.

> "The best managers are the ones who understand what they're managing." — Someone wise, probably.

AI doesn't resolve the conflict. It gives you more time to live in both branches.
```

- [ ] **Step 2: Create `lib/posts.ts`**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingTime: string;
  content: string;
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDirectory);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        excerpt: data.excerpt || "",
        readingTime: stats.text,
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return undefined;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    excerpt: data.excerpt || "",
    readingTime: stats.text,
    content,
  };
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
```

- [ ] **Step 3: Create `lib/mdx.ts`**

```ts
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { MDXComponents } from "@/components/MDXComponents";

export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components: MDXComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark-dimmed",
              keepBackground: true,
            },
          ],
        ],
      },
    },
  });

  return content;
}
```

- [ ] **Step 4: Create placeholder `components/MDXComponents.tsx`**

```tsx
import type { MDXComponents as MDXComponentsType } from "mdx/types";

export const MDXComponents: MDXComponentsType = {
  // Custom components will be added in Task 5
};
```

- [ ] **Step 5: Verify content layer works**

Create a temporary test script `test-posts.ts`:

```ts
import { getAllPosts, getAllTags } from "./lib/posts";

const posts = getAllPosts();
console.log("Posts:", posts.length);
console.log("First post:", posts[0]?.title, "—", posts[0]?.readingTime);
console.log("Tags:", getAllTags());
```

```bash
npx tsx test-posts.ts && rm test-posts.ts
```

Expected: 1 post found with title and reading time.

- [ ] **Step 6: Commit**

```bash
git add content/ lib/ components/MDXComponents.tsx
git commit -m "feat: add content layer with MDX parsing and seed post"
```

---

### Task 3: Core UI Components

**Files:**
- Create: `components/Header.tsx`, `components/Footer.tsx`, `components/TagBadge.tsx`, `components/PostCard.tsx`, `components/NewsletterForm.tsx`

- [ ] **Step 1: Create `components/Header.tsx`**

```tsx
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-extrabold tracking-tight">
          <span className="text-text-primary">MERGE</span>
          <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
            CONFLICT
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-text-muted">
          <Link href="/" className="transition-colors duration-200 hover:text-text-primary">
            Posts
          </Link>
          <Link href="/about" className="transition-colors duration-200 hover:text-text-primary">
            About
          </Link>
          <Link
            href="#newsletter"
            className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text font-bold text-transparent"
          >
            Newsletter
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create `components/TagBadge.tsx`**

```tsx
import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
}

export function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const className =
    "inline-block rounded-full border border-accent-orange/30 px-3 py-1 text-xs font-semibold text-accent-orange transition-colors duration-200 hover:border-accent-orange/60";

  if (linked) {
    return (
      <Link href={`/tags/${tag}`} className={className}>
        {tag}
      </Link>
    );
  }

  return <span className={className}>{tag}</span>;
}
```

- [ ] **Step 3: Create `components/PostCard.tsx`**

```tsx
import Link from "next/link";
import { TagBadge } from "./TagBadge";
import type { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="rounded-xl border border-border bg-surface p-8 transition-colors duration-200 hover:border-accent-orange/40">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block rounded bg-gradient-to-r from-accent-orange to-accent-pink px-3 py-1 text-xs font-bold uppercase tracking-widest text-black">
                Latest
              </span>
              <span className="text-sm text-text-muted">{post.date}</span>
              <span className="text-sm text-text-muted">·</span>
              <span className="text-sm text-text-muted">{post.readingTime}</span>
            </div>
            <h2 className="mb-3 font-heading text-3xl font-extrabold tracking-tight text-text-primary">
              {post.title}
            </h2>
            <p className="mb-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {post.excerpt}
            </p>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} linked={false} />
              ))}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="rounded-xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent-orange/40">
          <div className="mb-3 flex items-center gap-2 text-sm text-text-muted">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h3 className="mb-2 font-heading text-xl font-bold tracking-tight text-text-primary">
            {post.title}
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-text-secondary line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} linked={false} />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
```

- [ ] **Step 4: Create `components/NewsletterForm.tsx`**

```tsx
"use client";

import { useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFocus() {
    trackEvent("newsletter_cta_click");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    trackEvent("newsletter_signup", { email_domain: email.split("@")[1] });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-accent-orange/30 bg-surface p-6 text-center">
        <p className="font-heading text-lg font-bold text-text-primary">
          Thanks! You'll hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      id="newsletter"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">
        Subscribe to the newsletter
      </h3>
      <p className="mb-4 text-sm text-text-muted">
        Essays on engineering management, coding, and AI. No spam.
      </p>
      <div className="flex gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-1 focus:ring-accent-orange"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-gradient-to-r from-accent-orange to-accent-pink px-6 py-2.5 text-sm font-bold text-black transition-opacity duration-200 hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 5: Create `components/Footer.tsx`**

```tsx
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12">
          <NewsletterForm />
        </div>
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span className="font-heading font-bold tracking-tight">
            <span className="text-text-primary">MERGE</span>
            <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
              CONFLICT
            </span>
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Add Header and Footer to root layout**

Update `app/layout.tsx` — add imports and wrap children:

```tsx
// Add imports at top:
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Replace <body> content:
<body className="min-h-screen bg-background font-body text-text-secondary antialiased">
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-orange focus:px-4 focus:py-2 focus:text-black"
  >
    Skip to content
  </a>
  <Header />
  <main id="main-content">{children}</main>
  <Footer />
</body>
```

- [ ] **Step 7: Verify components render**

```bash
npm run dev
```

Open `http://localhost:3000`. Expect: Header with logo and nav, centered logo text, Footer with newsletter form.

- [ ] **Step 8: Commit**

```bash
git add components/ app/layout.tsx
git commit -m "feat: add Header, Footer, PostCard, TagBadge, NewsletterForm components"
```

---

### Task 4: Analytics (`lib/analytics.ts` + GA4 component)

**Files:**
- Create: `lib/analytics.ts`, `components/GoogleAnalytics.tsx`, `components/ScrollDepthTracker.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `lib/analytics.ts`**

```ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackPageview(url: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
```

- [ ] **Step 2: Create `components/GoogleAnalytics.tsx`**

```tsx
"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
```

- [ ] **Step 3: Create `components/ScrollDepthTracker.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface ScrollDepthTrackerProps {
  slug: string;
}

export function ScrollDepthTracker({ slug }: ScrollDepthTrackerProps) {
  const firedRef = useRef(new Set<number>());

  useEffect(() => {
    const milestones = [25, 50, 75, 100];

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      milestones.forEach((milestone) => {
        if (percent >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          trackEvent("scroll_depth", { depth: milestone, slug });

          if (milestone === 75) {
            trackEvent("post_read", { slug });
          }
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return null;
}
```

- [ ] **Step 4: Add GoogleAnalytics to root layout**

Add to `app/layout.tsx`:

```tsx
// Add import:
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Add inside <body>, before <a> skip link:
<GoogleAnalytics />
```

- [ ] **Step 5: Create `.env.local` template**

Create `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Add `.env.local` to `.gitignore` if not already there.

Create `.env.example`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

- [ ] **Step 6: Verify no errors with GA disabled**

```bash
npm run dev
```

Open `http://localhost:3000`. Expect: no console errors. GA script should not load (no measurement ID set).

- [ ] **Step 7: Commit**

```bash
git add lib/analytics.ts components/GoogleAnalytics.tsx components/ScrollDepthTracker.tsx app/layout.tsx .env.example
git commit -m "feat: add GA4 analytics with scroll depth and custom event tracking"
```

---

### Task 5: MDX Components (code blocks, callouts, blockquotes)

**Files:**
- Modify: `components/MDXComponents.tsx`

- [ ] **Step 1: Implement MDX custom components**

Replace `components/MDXComponents.tsx`:

```tsx
import type { MDXComponents as MDXComponentsType } from "mdx/types";

export const MDXComponents: MDXComponentsType = {
  h2: (props) => (
    <h2
      className="mb-4 mt-12 font-heading text-2xl font-bold tracking-tight text-text-primary"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-8 font-heading text-xl font-semibold tracking-tight text-text-primary"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-6 text-lg leading-[1.75] text-text-secondary" {...props} />
  ),
  a: (props) => (
    <a
      className="text-accent-orange underline decoration-accent-orange/30 underline-offset-4 transition-colors duration-200 hover:decoration-accent-orange"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mb-6 ml-6 list-disc space-y-2 text-text-secondary" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-6 ml-6 list-decimal space-y-2 text-text-secondary" {...props} />
  ),
  li: (props) => <li className="text-lg leading-[1.75]" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-accent-orange/50 pl-6 italic text-text-muted"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-accent-orange"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
};
```

- [ ] **Step 2: Verify MDX rendering**

This will be tested in Task 6 when the blog post page is built.

- [ ] **Step 3: Commit**

```bash
git add components/MDXComponents.tsx
git commit -m "feat: add styled MDX components for prose, code blocks, and blockquotes"
```

---

### Task 6: Blog Post Page (`app/blog/[slug]/page.tsx`)

**Files:**
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create post page**

Create `app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { renderMDX } from "@/lib/mdx";
import { TagBadge } from "@/components/TagBadge";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `https://mergeconflict.space/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMDX(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <article className="mx-auto max-w-prose px-6 py-16">
      <ScrollDepthTracker slug={slug} />

      <div className="mb-6 flex gap-2">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h1 className="mb-4 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-text-primary md:text-5xl">
        {post.title}
      </h1>

      <div className="mb-12 flex items-center gap-3 text-sm text-text-muted">
        <time dateTime={post.date}>{post.date}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>

      <div className="prose-custom">{content}</div>

      <nav className="mt-12 flex justify-between border-t border-border pt-8">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group text-left"
          >
            <span className="text-sm text-text-muted">← Previous</span>
            <p className="font-heading font-bold text-text-primary transition-colors duration-200 group-hover:text-accent-orange">
              {prev.title}
            </p>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group text-right"
          >
            <span className="text-sm text-text-muted">Next →</span>
            <p className="font-heading font-bold text-text-primary transition-colors duration-200 group-hover:text-accent-orange">
              {next.title}
            </p>
          </Link>
        ) : <div />}
      </nav>

      <div className="mt-12">
        <NewsletterForm />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify post page renders**

```bash
npm run dev
```

Open `http://localhost:3000/blog/hello-world`. Expect: full post with title, tags, meta, styled MDX content with syntax-highlighted code block, blockquote, and newsletter CTA at the bottom.

- [ ] **Step 3: Commit**

```bash
git add app/blog/
git commit -m "feat: add blog post page with MDX rendering and scroll tracking"
```

---

### Task 7: Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Build home page**

Replace `app/page.tsx`:

```tsx
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {featured && (
        <section className="mb-16">
          <PostCard post={featured} featured />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-text-primary">
            All Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify home page**

```bash
npm run dev
```

Open `http://localhost:3000`. Expect: featured post card with gradient "Latest" badge, title, excerpt, tags. No "All Posts" section yet (only 1 post).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build home page with featured post and post grid"
```

---

### Task 8: Tags Pages

**Files:**
- Create: `app/tags/page.tsx`, `app/tags/[tag]/page.tsx`

- [ ] **Step 1: Create tags listing page**

Create `app/tags/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getAllTags } from "@/lib/posts";
import { TagBadge } from "@/components/TagBadge";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by topic",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        Tags
      </h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ name, count }) => (
          <span key={name} className="flex items-center gap-2">
            <TagBadge tag={name} />
            <span className="text-sm text-text-muted">({count})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create tag filter page**

Create `app/tags/[tag]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ name }) => ({ tag: name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged "${tag}"`,
    description: `All posts about ${tag} on Merge Conflict`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        Posts tagged{" "}
        <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
          {tag}
        </span>
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify tags pages**

```bash
npm run dev
```

Open `http://localhost:3000/tags`. Expect: "Tags" heading with "ai", "management", "engineering" badges with counts.
Open `http://localhost:3000/tags/ai`. Expect: filtered post list.

- [ ] **Step 4: Commit**

```bash
git add app/tags/
git commit -m "feat: add tags listing and tag filter pages"
```

---

### Task 9: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create about page**

Create `app/about/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Merge Conflict — the blog about the tension between management and engineering.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        About
      </h1>
      <div className="space-y-6 text-lg leading-[1.75] text-text-secondary">
        <p>
          <strong className="text-text-primary">Merge Conflict</strong> is a blog about the tension
          between being an engineering manager and still writing code — and how AI is changing both
          sides of that equation.
        </p>
        <p>
          I'm an engineering manager who never fully left the codebase. Every day is a merge conflict
          between the manager branch and the engineer branch. This blog is where I work through that
          tension.
        </p>
        <p>
          Topics here include engineering management, hands-on coding, AI tools and workflows,
          and the evolving role of technical leaders in the age of AI.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify about page**

```bash
npm run dev
```

Open `http://localhost:3000/about`. Expect: styled about page with proper typography.

- [ ] **Step 3: Commit**

```bash
git add app/about/
git commit -m "feat: add about page"
```

---

### Task 10: Newsletter Viewport Tracking + Final Polish

**Files:**
- Modify: `components/NewsletterForm.tsx`, `app/layout.tsx`

- [ ] **Step 1: Add viewport tracking to NewsletterForm**

Add Intersection Observer to `components/NewsletterForm.tsx`. Add after the `formRef` declaration:

```tsx
useEffect(() => {
  const el = formRef.current;
  if (!el) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        trackEvent("newsletter_cta_view");
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(el);
  return () => observer.disconnect();
}, []);
```

Add `useEffect` to the import from React.

- [ ] **Step 2: Build and verify no errors**

```bash
npm run build
```

Expected: successful build with all pages statically generated.

- [ ] **Step 3: Commit**

```bash
git add components/NewsletterForm.tsx
git commit -m "feat: add newsletter viewport tracking and final polish"
```

---

### Task 11: Production Readiness

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Verify `.gitignore` includes all necessary entries**

Ensure `.gitignore` has:

```
.env.local
.env*.local
.superpowers/
```

- [ ] **Step 2: Run production build**

```bash
npm run build && npm run start
```

Open `http://localhost:3000`. Walk through all pages:
- Home (`/`) — featured post renders
- Post (`/blog/hello-world`) — MDX renders with code highlighting
- Tags (`/tags`) — tags with counts
- Tag filter (`/tags/ai`) — filtered posts
- About (`/about`) — content renders

- [ ] **Step 3: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: production readiness — gitignore and env template"
```
