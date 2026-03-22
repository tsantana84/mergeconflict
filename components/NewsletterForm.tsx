"use client";

import { useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFocus() {
    trackEvent("newsletter_cta_click");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    trackEvent("newsletter_signup", { email_domain: email.split("@")[1] });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-accent-orange/30 bg-surface p-6 text-center">
        <p className="font-heading text-lg font-bold text-text-primary">
          Thanks! You'll hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      id="newsletter"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">
        Subscribe to the newsletter
      </h3>
      <p className="mb-4 text-sm text-text-muted">
        Essays on engineering management, coding, and AI. No spam.
      </p>
      <div className="flex gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-1 focus:ring-accent-orange"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-gradient-to-r from-accent-orange to-accent-pink px-6 py-2.5 text-sm font-bold text-black transition-opacity duration-200 hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
