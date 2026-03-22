"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface ScrollDepthTrackerProps {
  slug: string;
}

export function ScrollDepthTracker({ slug }: ScrollDepthTrackerProps) {
  const firedRef = useRef(new Set<number>());

  useEffect(() => {
    const milestones = [25, 50, 75, 100];

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      milestones.forEach((milestone) => {
        if (percent >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          trackEvent("scroll_depth", { depth: milestone, slug });

          if (milestone === 75) {
            trackEvent("post_read", { slug });
          }
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return null;
}
