"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import ProjectArt from "@/components/ProjectArt";
import Parallax from "@/components/Parallax";
import TiltCard from "@/components/TiltCard";

export default function ProjectCard({
  project,
  aspect = "aspect-[4/3]",
  onPreview,
}: {
  project: Project;
  aspect?: string;
  onPreview?: (project: Project) => void;
}) {
  return (
    <article className="group">
      <TiltCard className={`overflow-hidden rounded-[3px] ${aspect}`}>
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]">
          <Parallax amount={0.05} className="h-full w-full">
            <ProjectArt {...project.art} />
          </Parallax>
        </div>
        <Link
          href={`/work/${project.slug}/`}
          data-cursor="View"
          aria-label={`Read the ${project.client} case study`}
          className="absolute inset-0 z-10"
        />
        <span className="mono-s absolute right-4 top-4 rounded-full border border-moon/20 px-3 py-1 text-moon/80 backdrop-blur-sm">
          {project.year}
        </span>
        {onPreview && (
          <button
            type="button"
            onClick={() => onPreview(project)}
            aria-label={`Preview ${project.client}`}
            className="mono-s absolute bottom-4 left-4 z-20 rounded-full border border-moon/30 bg-night/30 px-4 py-2 text-moon opacity-100 backdrop-blur-sm transition-all hover:border-corona-soft/80 hover:bg-night/60 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            Preview ↗
          </button>
        )}
      </TiltCard>
      <div className="mt-5 flex items-baseline justify-between gap-6 border-b border-hairline pb-5">
        <div>
          <h3 className="display display-md transition-colors duration-300 group-hover:text-corona-soft">
            <Link href={`/work/${project.slug}/`} data-cursor="View">
              {project.client}
            </Link>
          </h3>
          <p className="serif-i mt-1 text-lg text-ash">{project.narrative}</p>
        </div>
        <span className="mono-s shrink-0 text-ash max-sm:hidden">{project.sector}</span>
      </div>
    </article>
  );
}
