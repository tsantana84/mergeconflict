import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
  locale?: Locale;
}

export function TagBadge({ tag, linked = true, locale = "en" }: TagBadgeProps) {
  const className =
    "inline-block rounded-full border border-accent-orange/30 px-3 py-1 text-xs font-semibold text-accent-orange transition-colors duration-200 hover:border-accent-orange/60";

  const prefix = locale === "en" ? "" : "/pt";

  if (linked) {
    return (
      <Link href={`${prefix}/tags/${tag}`} className={className}>
        {tag}
      </Link>
    );
  }

  return <span className={className}>{tag}</span>;
}
