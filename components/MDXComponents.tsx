import type { MDXComponents as MDXComponentsType } from "mdx/types";

export const MDXComponents: MDXComponentsType = {
  h2: (props) => (
    <h2
      className="mb-4 mt-12 font-heading text-2xl font-bold tracking-tight text-text-primary"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-8 font-heading text-xl font-semibold tracking-tight text-text-primary"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-6 text-lg leading-[1.75] text-text-secondary" {...props} />
  ),
  a: (props) => (
    <a
      className="text-accent-orange underline decoration-accent-orange/30 underline-offset-4 transition-colors duration-200 hover:decoration-accent-orange"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mb-6 ml-6 list-disc space-y-2 text-text-secondary" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-6 ml-6 list-decimal space-y-2 text-text-secondary" {...props} />
  ),
  li: (props) => <li className="text-lg leading-[1.75]" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-accent-orange/50 pl-6 italic text-text-muted"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-accent-orange"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
};
