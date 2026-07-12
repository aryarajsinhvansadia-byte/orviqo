"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProjectCard from "@/components/ProjectCard";
import ProjectPreview from "@/components/ProjectPreview";
import { projects, categories, type Project } from "@/lib/projects";

export default function WorkGallery() {
  const [active, setActive] = useState<string>("all");
  const [preview, setPreview] = useState<Project | null>(null);
  const shown =
    active === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(active as never));

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by discipline"
        className="flex flex-wrap gap-2 border-t border-hairline pt-6"
      >
        {categories.map((c) => {
          const selected = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              aria-pressed={selected}
              className={`relative rounded-full border px-5 py-2 text-sm transition-all duration-300 ${
                selected
                  ? "border-corona-soft/60 text-moon light-rim"
                  : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
              }`}
            >
              {c.label}
              <span className="mono-s ml-2 text-[0.62rem] text-ash">
                {c.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.categories.includes(c.id as never)).length}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} onPreview={setPreview} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <ProjectPreview
        project={preview}
        position={Math.max(0, shown.findIndex((project) => project.slug === preview?.slug))}
        total={shown.length}
        onClose={() => setPreview(null)}
        onBrowse={(direction) => {
          if (!preview || shown.length < 2) return;
          const current = shown.findIndex((project) => project.slug === preview.slug);
          setPreview(shown[(current + direction + shown.length) % shown.length]);
        }}
      />
    </div>
  );
}
