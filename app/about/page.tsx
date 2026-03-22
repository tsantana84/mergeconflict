import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Merge Conflict — the blog about the tension between management and engineering.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-16">
      <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-text-primary">
        About
      </h1>
      <div className="space-y-6 text-lg leading-[1.75] text-text-secondary">
        <p>
          <strong className="text-text-primary">Merge Conflict</strong> is a blog about the tension
          between being an engineering manager and still writing code — and how AI is changing both
          sides of that equation.
        </p>
        <p>
          I'm an engineering manager who never fully left the codebase. Every day is a merge conflict
          between the manager branch and the engineer branch. This blog is where I work through that
          tension.
        </p>
        <p>
          Topics here include engineering management, hands-on coding, AI tools and workflows,
          and the evolving role of technical leaders in the age of AI.
        </p>
      </div>
    </div>
  );
}
