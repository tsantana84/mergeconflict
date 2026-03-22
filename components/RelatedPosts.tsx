import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-6 font-heading text-xl font-bold tracking-tight text-text-primary">
        More Like This
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border border-border bg-surface p-4 transition-colors duration-200 hover:border-accent-orange/40"
          >
            {post.image && (
              <div className="relative mb-3 aspect-video overflow-hidden rounded-md">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            )}
            <h3 className="mb-1 font-heading text-sm font-bold text-text-primary transition-colors duration-200 group-hover:text-accent-orange">
              {post.title}
            </h3>
            <span className="text-xs text-text-muted">{post.readingTime}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
