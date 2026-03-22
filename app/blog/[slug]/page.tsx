import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getAdjacentPosts, getRelatedPosts } from "@/lib/posts";
import { renderMDX } from "@/lib/mdx";
import { TagBadge } from "@/components/TagBadge";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import Image from "next/image";
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

  const url = `https://mergeconflict.space/blog/${slug}`;
  const imageUrl = post.image
    ? `https://mergeconflict.space${post.image}`
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Thiago Santana"],
      tags: post.tags,
      url,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMDX(post.content);
  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug, post.tags);
  const postUrl = `https://mergeconflict.space/blog/${slug}`;

  return (
    <article className="mx-auto max-w-prose px-4 py-10 sm:px-6 sm:py-16">
      <BlogPostingJsonLd post={post} url={postUrl} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://mergeconflict.space" },
          { name: "Blog", url: "https://mergeconflict.space" },
          { name: post.title, url: postUrl },
        ]}
      />
      <ScrollDepthTracker slug={slug} />

      <div className="mb-6 flex gap-2">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h1 className="mb-4 font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
        {post.title}
      </h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <ShareButtons url={postUrl} title={post.title} />
      </div>

      {post.image && (
        <div className="relative mb-12 aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="680px"
            priority
          />
        </div>
      )}

      <div className="prose-custom">{content}</div>

      <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <ShareButtons url={postUrl} title={post.title} />
      </div>

      <RelatedPosts posts={related} />

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
