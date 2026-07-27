import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORVIQO — Intelligent digital systems",
    short_name: "ORVIQO",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a10",
    theme_color: "#0a0a10",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Talk to us", short_name: "Talk", url: "/talk/" },
      { name: "Demo Lab", short_name: "Demo", url: "/demo-lab/" },
      { name: "Our work", short_name: "Work", url: "/work/" },
    ],
  };
}
