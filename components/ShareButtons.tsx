"use client";

import { trackEvent } from "@/lib/analytics";

interface ShareButtonsProps {
  url: string;
  title: string;
  shareLabel?: string;
}

export function ShareButtons({ url, title, shareLabel = "Share" }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.178 3.126-4.598.695-8.658 3.029-4.888 8.157C5.883 27.07 13.905 20.29 12 16.022c1.905 4.268 6.066 10.956 10.086 5.508 3.77-5.128-.29-7.462-4.888-8.157 2.578.35 5.393-.499 6.178-3.126C23.622 9.418 24 4.458 24 3.768c0-.688-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
        </svg>
      ),
    },
  ];

  function handleClick(platform: string) {
    trackEvent("share_click", { platform, slug: url });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted">{shareLabel}</span>
      {platforms.map(({ name, href, icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(name.toLowerCase())}
          aria-label={`Share on ${name}`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-text-muted transition-colors duration-200 hover:border-accent-orange/40 hover:text-accent-orange"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
