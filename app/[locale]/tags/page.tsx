import type { Metadata } from "next";
import { getAllTags } from "@/lib/posts";
import { TagBadge } from "@/components/TagBadge";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse all topics on Merge Conflict: AI, engineering leadership, coding, and more.",
  openGraph: {
    title: "Tags | Merge Conflict",
    description: "Browse all topics on Merge Conflict.",
    url: "https://mergeconflict.space/tags",
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TagsPage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const tags = getAllTags(typedLocale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        {dict.tags.title}
      </h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ name, count }) => (
          <span key={name} className="flex items-center gap-2">
            <TagBadge tag={name} locale={typedLocale} />
            <span className="text-sm text-text-muted">({count})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
