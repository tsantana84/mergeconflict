import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="font-heading text-lg sm:text-xl font-extrabold tracking-tight shrink-0">
          <span className="text-text-primary">MERGE</span>
          <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
            CONFLICT
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium text-text-muted">
          <Link href="/" className="transition-colors duration-200 hover:text-text-primary">
            Posts
          </Link>
          <Link href="/about" className="transition-colors duration-200 hover:text-text-primary">
            About
          </Link>
          <Link
            href="#newsletter"
            className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text font-bold text-transparent"
          >
            Newsletter
          </Link>
        </div>
      </nav>
    </header>
  );
}
