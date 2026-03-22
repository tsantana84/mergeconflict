export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span className="font-heading font-bold tracking-tight">
            <span className="text-text-primary">MERGE</span>
            <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
              CONFLICT
            </span>
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
