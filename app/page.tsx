import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { WebSiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Merge Conflict | Engineering Leadership, AI & Code",
  description:
    "The tension between being an engineering manager and still writing code. Posts about AI, leadership, and engineering by Thiago Santana.",
  openGraph: {
    title: "Merge Conflict | Engineering Leadership, AI & Code",
    description:
      "The tension between being an engineering manager and still writing code. Posts about AI, leadership, and engineering.",
    url: "https://mergeconflict.space",
  },
};

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <WebSiteJsonLd />
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
