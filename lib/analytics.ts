export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackPageview(url: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
