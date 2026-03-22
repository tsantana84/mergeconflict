"use client";

import { useState, useRef, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface NewsletterFormProps {
  dict?: {
    title: string;
    description: string;
    placeholder: string;
    subscribe: string;
    thanks: string;
  };
}

const defaultDict = {
  title: "Subscribe to the newsletter",
  description: "Essays on engineering management, coding, and AI. No spam.",
  placeholder: "you@example.com",
  subscribe: "Subscribe",
  thanks: "Thanks! You'll hear from us soon.",
};

export function NewsletterForm({ dict = defaultDict }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("newsletter_cta_view");
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
          {dict.thanks}
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
        {dict.title}
      </h3>
      <p className="mb-4 text-sm text-text-muted">
        {dict.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder={dict.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-1 focus:ring-accent-orange"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-gradient-to-r from-accent-orange to-accent-pink px-6 py-2.5 text-sm font-bold text-black transition-opacity duration-200 hover:opacity-90"
        >
          {dict.subscribe}
        </button>
      </div>
    </form>
  );
}
