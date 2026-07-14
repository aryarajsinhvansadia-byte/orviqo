import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import SectionHead from "@/components/SectionHead";
import { Rise } from "@/components/motion";
import { featuredProjects } from "@/lib/projects";

export default function SelectedWork() {
  const [a, b] = featuredProjects;
  return (
    <section className="shell section">
      <SectionHead
        eyebrow="Selected work"
        title={
          <>
            The work does <em className="serif-i not-italic">the talking.</em>
          </>
        }
      />
      <div className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2">
        {a && (
          <Rise className="md:mt-0">
            <ProjectCard project={a} aspect="aspect-[4/3]" />
          </Rise>
        )}
        {b && (
          <Rise delay={0.12} className="md:mt-24">
            <ProjectCard project={b} aspect="aspect-[4/3]" />
          </Rise>
        )}
      </div>
      <Rise className="mt-16 flex justify-center">
        <Button href="/work/" variant="ghost">
          Every project
        </Button>
      </Rise>
    </section>
  );
}
