import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { getDictionary } from "@/lib/dictionaries";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; tag: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; tag: string }[] = [];
  for (const locale of locales) {
    const tags = getAllTags(locale);
    for (const { name } of tags) {
      params.push({ locale, tag: name });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag, locale } = await params;
  const prefix = locale === "en" ? "" : "/pt";
  return {
    title: `Posts tagged "${tag}"`,
    description: `All posts about ${tag} on Merge Conflict.`,
    openGraph: {
      title: `Posts tagged "${tag}" | Merge Conflict`,
      description: `All posts about ${tag} on Merge Conflict.`,
      url: `https://mergeconflict.space${prefix}/tags/${tag}`,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag, locale } = await params;
  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const posts = getPostsByTag(tag, typedLocale);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        {dict.tags.postsTagged}{" "}
        <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
          {tag}
        </span>
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={typedLocale} />
        ))}
      </div>
    </div>
  );
}
