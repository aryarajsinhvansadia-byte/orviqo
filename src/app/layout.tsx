import type { Metadata } from "next";
import { Archivo, Instrument_Serif, Fragment_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgentChat from "@/components/AgentChat";
import LivingBackground from "@/components/LivingBackground";
import { site } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const fragment = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ORVIQO — Intelligent digital systems. The quiet kind of famous.",
    template: "%s — ORVIQO",
  },
  description: site.description,
  keywords: [
    "AI agency",
    "AI agents",
    "agentic AI",
    "business automation",
    "AI chatbots",
    "voice AI",
    "digital transformation",
    "web design agency",
    "Next.js development",
    "SEO agency",
    "answer engine optimisation",
    "generative engine optimisation",
    "AI consulting",
    "brand identity",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: "ORVIQO — The quiet kind of famous.",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ORVIQO — The quiet kind of famous.",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  slogan: site.tagline,
  foundingDate: site.founded,
  knowsAbout: [
    "AI agents",
    "Agentic AI",
    "Multi-agent systems",
    "AI chatbots",
    "Retrieval-augmented generation",
    "Voice AI",
    "AI copilots",
    "Document intelligence",
    "Enterprise AI search",
    "Business process automation",
    "Web development",
    "SEO",
    "Answer engine optimisation",
    "Generative engine optimisation",
    "AI strategy and governance",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vadodara",
    addressCountry: "IN",
  },
  sameAs: site.socials.map((s) => s.href),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${fragment.variable} antialiased`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-moon focus:px-5 focus:py-2 focus:text-night"
        >
          Skip to content
        </a>
        <LivingBackground />
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <AgentChat />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
