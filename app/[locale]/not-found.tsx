import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <p className="text-6xl font-heading font-extrabold bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
        404
      </p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
        Page not found
      </h1>
      <p className="mt-2 text-text-secondary">
        Looks like this branch was never merged.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-gradient-to-r from-accent-orange to-accent-pink px-6 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
      >
        Back to main
      </Link>
    </div>
  );
}
