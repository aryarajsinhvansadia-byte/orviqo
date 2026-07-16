import type { Project } from "@/lib/projects";
import ProjectArt from "@/components/ProjectArt";

/**
 * A project's cover. Uses the real screenshot when the project has one,
 * and falls back to the generated abstract art otherwise — so a new project
 * looks intentional the moment it's added, before its shot exists.
 */
export default function ProjectMedia({
  project,
  fill = false,
  className = "",
  priority = false,
}: {
  project: Project;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (project.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.cover}
        alt={`${project.client} — ${project.sector}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`${fill ? "absolute inset-0" : ""} h-full w-full object-cover ${className}`}
      />
    );
  }
  return <ProjectArt {...project.art} fill={fill} className={className} />;
}
