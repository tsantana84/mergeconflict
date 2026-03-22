export function trackEvent(action: string, params?: Record<string, string | number>) {
  // Stub — will be fully implemented in Task 4
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
