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

      {/* What is Merge Conflict */}
      <div className="space-y-5 text-lg leading-[1.75] text-text-secondary">
        <h2 className="font-heading text-xl font-bold text-text-primary">
          What is Merge Conflict
        </h2>
        <p>
          <strong className="text-text-primary">Merge Conflict</strong> is a
          blog about what happens when you refuse to pick a lane. Management or
          engineering. Strategy or code. People problems or technical problems.
          This blog lives in the diff between both.
        </p>
      </div>

      {/* About me */}
      <div className="mt-10 space-y-5 text-lg leading-[1.75] text-text-secondary">
        <h2 className="font-heading text-xl font-bold text-text-primary">
          About me
        </h2>
        <p>
          I&apos;m Thiago Santana, an engineering manager who&apos;s been
          writing more code lately than at any point since moving into
          management, thanks to AI. I stay off the critical path (my team owns
          the main branch), but I&apos;ve been using AI tools to build internal
          tooling, run experiments, and automate things that probably
          don&apos;t need automating. Before management, I spent years in
          backend engineering, and honestly, the terminal never stopped calling.
        </p>
      </div>

      {/* What to expect */}
      <div className="mt-10 space-y-5 text-lg leading-[1.75] text-text-secondary">
        <h2 className="font-heading text-xl font-bold text-text-primary">
          What to expect
        </h2>
        <p>
          Posts here cover engineering leadership, hands-on coding, and AI tools
          and workflows. Especially how AI is changing what&apos;s possible for
          managers who still want to build. No posting schedule, just whenever
          something is worth a <code className="text-text-primary">git push</code>.
        </p>
      </div>

      {/* Newsletter */}
      <div className="mt-12">
        <NewsletterForm />
      </div>
    </div>
  );
}
