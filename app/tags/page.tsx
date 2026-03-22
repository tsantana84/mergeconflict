import type { Metadata } from "next";
import { getAllTags } from "@/lib/posts";
import { TagBadge } from "@/components/TagBadge";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by topic",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        Tags
      </h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ name, count }) => (
          <span key={name} className="flex items-center gap-2">
            <TagBadge tag={name} />
            <span className="text-sm text-text-muted">({count})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
