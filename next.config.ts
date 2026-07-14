import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served on Vercel (not static Hostinger), so the AI chat API route can run
  // as a serverless function. Static pages are still prerendered at build.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
