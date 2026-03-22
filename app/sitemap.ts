import { getAllPosts, getAllTags } from "@/lib/posts";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { MetadataRoute } from "next";

const BASE_URL = "https://mergeconflict.space";

function localUrl(locale: Locale, path: string) {
  return locale === "en" ? `${BASE_URL}${path}` : `${BASE_URL}/pt${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const posts = getAllPosts(locale);
    const tags = getAllTags(locale);

    entries.push({
      url: localUrl(locale, "/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
    });

    entries.push({
      url: localUrl(locale, "/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });

    entries.push({
      url: localUrl(locale, "/tags"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });

    for (const post of posts) {
      entries.push({
        url: localUrl(locale, `/blog/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const { name } of tags) {
      entries.push({
        url: localUrl(locale, `/tags/${name}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
