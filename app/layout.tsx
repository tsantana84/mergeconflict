import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Merge Conflict",
    template: "%s | Merge Conflict",
  },
  description:
    "The tension between being an engineering manager and still writing code. AI, leadership, and engineering.",
  metadataBase: new URL("https://mergeconflict.space"),
  openGraph: {
    type: "website",
    siteName: "Merge Conflict",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@thiagosantana",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
