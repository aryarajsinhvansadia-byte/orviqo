"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export type AccordionItem = {
  title: string;
  meta?: string;
  body: React.ReactNode;
};

export default function Accordion({
  items,
  light = false,
}: {
  items: AccordionItem[];
  light?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const line = light ? "border-inkline" : "border-hairline";
  const dim = light ? "text-night/60" : "text-ash";

  return (
    <div className={`border-t ${line}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`border-b ${line}`}>
            <button
              className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
              aria-controls={`${baseId}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="display-md display">{item.title}</span>
              <span className="flex items-center gap-4 shrink-0">
                {item.meta && <span className={`mono-s hidden sm:block ${dim}`}>{item.meta}</span>}
                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl leading-none"
                >
                  +
                </motion.span>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${baseId}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={`max-w-2xl pb-8 ${dim}`}>{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
