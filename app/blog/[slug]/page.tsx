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
