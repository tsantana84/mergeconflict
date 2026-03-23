import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "./i18n";
import { defaultLocale } from "./i18n";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  dateRaw: string;
  tags: string[];
  excerpt: string;
  readingTime: string;
  content: string;
  image?: string;
}

function getPostsDir(locale: Locale): string {
  if (locale === defaultLocale) return postsDirectory;
  return path.join(postsDirectory, locale);
}

function parsePost(file: string, dir: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const fullPath = path.join(dir, file);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  const rawDate = String(data.date);
  const displayDate = rawDate.slice(0, 10);

  return {
    slug,
    title: data.title,
    date: displayDate,
    dateRaw: rawDate,
    tags: data.tags || [],
    excerpt: data.excerpt || "",
    readingTime: stats.text,
    content,
    image: data.image || undefined,
  };
}

export function getAllPosts(locale: Locale = defaultLocale): Post[] {
  const dir = getPostsDir(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parsePost(file, dir))
    .sort((a, b) => (a.dateRaw > b.dateRaw ? -1 : 1));
}

export function getPostBySlug(slug: string, locale: Locale = defaultLocale): Post | undefined {
  const dir = getPostsDir(locale);
  const fullPath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return undefined;

  return parsePost(`${slug}.mdx`, dir);
}

export function getPostsByTag(tag: string, locale: Locale = defaultLocale): Post[] {
  return getAllPosts(locale).filter((post) => post.tags.includes(tag));
}

export function getAdjacentPosts(slug: string, locale: Locale = defaultLocale): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts(locale);
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getRelatedPosts(slug: string, tags: string[], limit = 3, locale: Locale = defaultLocale): Post[] {
  const posts = getAllPosts(locale).filter((p) => p.slug !== slug);

  const scored = posts.map((post) => {
    const shared = post.tags.filter((t) => tags.includes(t)).length;
    return { post, score: shared };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

export function getAllTags(locale: Locale = defaultLocale): { name: string; count: number }[] {
  const posts = getAllPosts(locale);
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
