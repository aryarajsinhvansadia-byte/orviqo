import Link from "next/link";
import Orb from "@/components/Orb";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden text-center">
      <div className="shell relative z-10 flex flex-col items-center">
        <p className="eyebrow mb-8">404 — Nothing here</p>
        <h1 className="display display-hero">
          A very <em className="serif-i not-italic">quiet</em> page.
        </h1>
        <p className="mt-8 max-w-md text-ash">
          Whatever lived at this address has moved on. Even our dead ends are
          considered — but this one leads home.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-moon px-7 py-3.5 font-medium text-night transition-colors duration-300 hover:bg-corona-soft"
        >
          Back to the light
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      <Orb variant="dawn" className="absolute inset-x-0 bottom-0 h-64" />
    </section>
  );
}
