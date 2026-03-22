import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PersonJsonLd } from "@/components/JsonLd";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Merge Conflict -- the blog about the tension between management and engineering. Written by Thiago Santana, engineering manager and coder from Rio de Janeiro.",
  openGraph: {
    title: "About | Merge Conflict",
    description:
      "About Merge Conflict -- the blog about the tension between management and engineering. Written by Thiago Santana.",
    url: "https://mergeconflict.space/about",
  },
};

const socials = [
  { label: "GitHub", href: "https://github.com/tsantana84" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/thiagorodriguessantana",
  },
  { label: "X", href: "https://x.com/thiagosantana" },
];

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <PersonJsonLd />
      {/* Hero: photo + name/tagline/socials */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-6 sm:gap-8">
        <Image
          src="/images/thiago.jpg"
          alt="Thiago Santana"
          width={176}
          height={176}
          className="h-32 w-32 sm:h-44 sm:w-44 flex-shrink-0 rounded-xl object-cover"
          priority
        />
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Thiago Santana
          </h1>
          <p className="mt-1 text-text-muted">
            {dict.about.role}
          </p>
          <p className="text-sm text-text-muted">{dict.about.location}</p>
          <div className="mt-4 flex justify-center sm:justify-start gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent-orange hover:text-text-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-10 border-border" />

      {/* What is Merge Conflict */}
      <div className="space-y-5 text-lg leading-[1.75] text-text-secondary">
        <h2 className="font-heading text-xl font-bold text-text-primary">
          {dict.about.whatIs}
        </h2>
        <p dangerouslySetInnerHTML={{ __html: dict.about.whatIsText }} />
      </div>

      {/* About me */}
      <div className="mt-10 space-y-5 text-lg leading-[1.75] text-text-secondary">
        <h2 className="font-heading text-xl font-bold text-text-primary">
          {dict.about.aboutMe}
        </h2>
        <p>{dict.about.aboutMeText}</p>
      </div>

      {/* What to expect */}
      <div className="mt-10 space-y-5 text-lg leading-[1.75] text-text-secondary">
        <h2 className="font-heading text-xl font-bold text-text-primary">
          {dict.about.whatToExpect}
        </h2>
        <p dangerouslySetInnerHTML={{ __html: dict.about.whatToExpectText }} />
      </div>

      {/* AI disclaimer (PT only) */}
      {dict.about.aiDisclaimer && (
        <p className="mt-10 text-sm text-text-muted italic">
          {dict.about.aiDisclaimer}
        </p>
      )}

      {/* Newsletter */}
      <div className="mt-12">
        <NewsletterForm dict={dict.newsletter} />
      </div>
    </div>
  );
}
