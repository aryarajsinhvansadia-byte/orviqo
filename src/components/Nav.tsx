"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { nav, site } from "@/lib/site";
import { startScroll, stopScroll } from "@/components/SmoothScroll";
import LocalTime from "@/components/LocalTime";
import Orb from "@/components/Orb";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const lastY = useRef(0);
  const { scrollY } = useScroll();
  const firstLink = useRef<HTMLAnchorElement>(null);

  // intelligent sticky: hide going down, return going up
  useEffect(() => {
    return scrollY.on("change", (y) => {
      if (!open) setHidden(y > 140 && y > lastY.current);
      lastY.current = y;
    });
  }, [scrollY, open]);

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // scroll lock + esc + focus
  useEffect(() => {
    if (open) {
      stopScroll();
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      const t = setTimeout(() => firstLink.current?.focus(), 650);
      return () => {
        window.removeEventListener("keydown", onKey);
        clearTimeout(t);
      };
    }
    startScroll();
    document.body.style.overflow = "";
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-80 mix-blend-difference"
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="shell flex items-center justify-between py-5 text-moon">
          <Link
            href="/"
            className="display flex items-center gap-2.5 text-[1.05rem] tracking-[0.22em]"
            aria-label="ORVIQO — home"
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
                boxShadow: "0 0 10px rgba(255,139,61,0.7)",
              }}
            />
            ORVIQO
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/contact/"
              className="mono-s hidden underline-offset-4 hover:underline md:block"
            >
              Start a project
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex h-10 items-center gap-3"
            >
              <span className="mono-s">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-6" aria-hidden>
                <span
                  className={`absolute left-0 top-0 h-px w-6 bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "group-hover:w-4"
                  }`}
                />
                <span
                  className={`absolute left-0 bottom-0 h-px w-6 bg-current transition-all duration-300 ${
                    open ? "bottom-1.5 -rotate-45" : "group-hover:w-5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-70 overflow-hidden bg-night"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Orb
              variant="ember"
              className="absolute right-[12%] top-[18%] h-40 w-40 opacity-60 max-md:hidden"
            />
            <div className="shell flex h-full flex-col overflow-y-auto pb-10 pt-28 md:pb-0">
              <nav className="mt-auto grid gap-x-16 md:my-auto md:grid-cols-[1fr_auto]">
                <ul>
                  {nav.menu.map((item, i) => (
                    <li key={item.href} className="overflow-hidden">
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "110%", transition: { duration: 0.3 } }}
                        transition={{
                          duration: 0.7,
                          delay: 0.25 + i * 0.055,
                          ease: EASE,
                        }}
                      >
                        <Link
                          ref={i === 0 ? firstLink : undefined}
                          href={item.href}
                          className={`group flex items-baseline gap-5 py-1 ${
                            pathname === item.href ? "text-moon" : "text-ash"
                          } transition-colors duration-300 hover:text-moon focus-visible:text-moon`}
                        >
                          <span className="display text-[clamp(2.2rem,6.5vh,4rem)] leading-[1.12]">
                            {item.label}
                          </span>
                          <span className="serif-i translate-y-1 text-lg text-corona-soft/0 transition-all duration-300 group-hover:text-corona-soft/90 max-md:hidden">
                            {item.hint}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-10 flex flex-col justify-end gap-2 text-ash md:mt-0 md:text-right"
                >
                  <a
                    href={`mailto:${site.email}`}
                    className="mono-s text-moon underline-offset-4 hover:underline"
                  >
                    {site.email}
                  </a>
                  <LocalTime />
                  <span className="mono-s">Working worldwide</span>
                  <div className="mt-4 flex gap-5 md:justify-end">
                    {site.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="mono-s text-ash transition-colors hover:text-moon"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
