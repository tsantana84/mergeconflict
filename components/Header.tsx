import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

function localePath(locale: Locale, path: string) {
  return locale === "en" ? path : `/pt${path}`;
}

export function Header({ locale, dict }: HeaderProps) {
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href={localePath(locale, "/")} className="font-heading text-lg sm:text-xl font-extrabold tracking-tight shrink-0">
          <span className="text-text-primary">MERGE</span>
          <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
            CONFLICT
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium text-text-muted">
          <Link href={localePath(locale, "/")} className="transition-colors duration-200 hover:text-text-primary">
            {dict.nav.posts}
          </Link>
          <Link href={localePath(locale, "/about")} className="transition-colors duration-200 hover:text-text-primary">
            {dict.nav.about}
          </Link>
          <Link
            href="#newsletter"
            className="hidden sm:inline bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text font-bold text-transparent"
          >
            {dict.nav.newsletter}
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>
      </nav>
    </header>
  );
}
