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
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-8 transition-colors duration-200 hover:border-accent-orange/40">
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-block rounded bg-gradient-to-r from-accent-orange to-accent-pink px-3 py-1 text-xs font-bold uppercase tracking-widest text-black">
                Latest
              </span>
              <span className="text-sm text-text-muted">{post.date}</span>
              <span className="text-sm text-text-muted">·</span>
              <span className="text-sm text-text-muted">{post.readingTime}</span>
            </div>
            <h2 className="mb-3 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
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
