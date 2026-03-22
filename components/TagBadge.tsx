import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
}

export function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const className =
    "inline-block rounded-full border border-accent-orange/30 px-3 py-1 text-xs font-semibold text-accent-orange transition-colors duration-200 hover:border-accent-orange/60";

  if (linked) {
    return (
      <Link href={`/tags/${tag}`} className={className}>
        {tag}
      </Link>
    );
  }

  return <span className={className}>{tag}</span>;
}
