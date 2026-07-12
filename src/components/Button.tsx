import Link from "next/link";
import type { ReactNode } from "react";
import Magnetic from "@/components/Magnetic";

const base =
  "group relative inline-flex items-center gap-3 rounded-full font-medium transition-colors duration-300";

const styles = {
  solid:
    "bg-moon text-night px-7 py-3.5 hover:bg-corona-soft",
  ghost:
    "border border-hairline px-7 py-3.5 text-moon hover:border-moon/40 light-rim-hover",
  dark: "bg-night text-moon px-7 py-3.5 hover:bg-slate border border-night",
} as const;

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export default function Button({
  href,
  children,
  variant = "solid",
  arrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  arrow?: boolean;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const cls = `${base} ${styles[variant]} ${className}`;
  return (
    <Magnetic>
      {external ? (
        <a href={href} className={cls}>
          <span>{children}</span>
          {arrow && <Arrow />}
        </a>
      ) : (
        <Link href={href} className={cls}>
          <span>{children}</span>
          {arrow && <Arrow />}
        </Link>
      )}
    </Magnetic>
  );
}
