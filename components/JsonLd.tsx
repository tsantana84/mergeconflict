import type { Post } from "@/lib/posts";

interface BlogPostingProps {
  post: Post;
  url: string;
}

export function BlogPostingJsonLd({ post, url }: BlogPostingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    author: {
      "@type": "Person",
      name: "Thiago Santana",
      url: "https://mergeconflict.space/about",
      jobTitle: "Engineering Manager",
    },
    publisher: {
      "@type": "Organization",
      name: "Merge Conflict",
      url: "https://mergeconflict.space",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
    ...(post.image && {
      image: {
        "@type": "ImageObject",
        url: `https://mergeconflict.space${post.image}`,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Merge Conflict",
    description:
      "The tension between being an engineering manager and still writing code. AI, leadership, and engineering.",
    url: "https://mergeconflict.space",
    author: {
      "@type": "Person",
      name: "Thiago Santana",
      url: "https://mergeconflict.space/about",
      jobTitle: "Engineering Manager",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Thiago Santana",
    url: "https://mergeconflict.space/about",
    jobTitle: "Engineering Manager",
    sameAs: [
      "https://github.com/tsantana84",
      "https://www.linkedin.com/in/thiagorodriguessantana",
      "https://x.com/thiagosantana",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
