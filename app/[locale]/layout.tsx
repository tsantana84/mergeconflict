import { notFound } from "next/navigation";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { isValidLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const htmlLang = locale === "pt" ? "pt-BR" : "en";

  return (
    <html
      lang={htmlLang}
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-text-secondary antialiased">
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-orange focus:px-4 focus:py-2 focus:text-black"
        >
          {dict.skipToContent}
        </a>
        <Header locale={locale as Locale} dict={dict} />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
