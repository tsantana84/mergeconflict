import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { WebSiteJsonLd } from "@/components/JsonLd";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

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

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const posts = getAllPosts(typedLocale);
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <WebSiteJsonLd />
      {featured && (
        <section className="mb-16">
          <PostCard post={featured} featured locale={typedLocale} latestLabel={dict.home.latest} />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-text-primary">
            {dict.home.allPosts}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} locale={typedLocale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
