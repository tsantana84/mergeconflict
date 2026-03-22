"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Build the path for the other locale
  let targetPath: string;
  if (locale === "pt") {
    // Remove /pt prefix to go to English
    targetPath = pathname.replace(/^\/pt/, "") || "/";
  } else {
    // Add /pt prefix to go to Portuguese
    targetPath = `/pt${pathname}`;
  }

  const targetLocale = locale === "en" ? "pt" : "en";
  const label = locale === "en" ? "PT" : "EN";

  return (
    <Link
      href={targetPath}
      locale={false}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-xs font-bold text-text-muted transition-colors duration-200 hover:border-accent-orange/40 hover:text-accent-orange"
      title={targetLocale === "pt" ? "Ver em Portugues" : "View in English"}
    >
      {label}
    </Link>
  );
}
