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
