import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { posts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "about",
    "services",
    "work",
    "case-studies",
    "process",
    "journal",
    "careers",
    "contact",
    "privacy",
    "terms",
  ].map((p) => ({
    url: `${site.url}/${p ? `${p}/` : ""}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const projectPages = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}/`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const postPages = posts.map((p) => ({
    url: `${site.url}/journal/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...projectPages, ...postPages];
}
