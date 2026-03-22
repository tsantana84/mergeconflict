import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Merge Conflict — the blog about the tension between management and engineering.",
};

const socials = [
  { label: "GitHub", href: "https://github.com/tsantana84" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/thiagorodriguessantana",
  },
  { label: "X", href: "https://x.com/thiagosantana" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Hero: photo + name/tagline/socials */}
      <div className="flex items-center gap-8">
        <Image
          src="/images/thiago.jpg"
          alt="Thiago Santana"
          width={176}
          height={176}
          className="h-44 w-44 flex-shrink-0 rounded-xl object-cover"
          priority
        />
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-text-primary">
            Thiago Santana
          </h1>
          <p className="mt-1 text-text-muted">
            Engineering Manager &middot; Coder
          </p>
          <p className="text-sm text-text-muted">Brazilian in Sweden</p>
          <div className="mt-4 flex gap-3">
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

      {/* Bio */}
      <div className="space-y-5 text-lg leading-[1.75] text-text-secondary">
        <p>
          <strong className="text-text-primary">Merge Conflict</strong> is a
          blog about the tension between being an engineering manager and still
          writing code — and how AI is changing both sides of that equation.
        </p>
        <p>
          I&apos;m an EM who never fully left the codebase. Every day is a merge
          conflict between the manager branch and the engineer branch. Before
          management, I spent years shipping backend systems and still get pulled
          back to the terminal more often than my calendar would like.
        </p>
        <p>
          When I&apos;m not resolving conflicts (the git kind or the people
          kind), you&apos;ll find me exploring AI tools, automating things that
          probably don&apos;t need automating, and writing about what I learn
          along the way.
        </p>
      </div>

      {/* Newsletter */}
      <div className="mt-12">
        <NewsletterForm />
      </div>
    </div>
  );
}
