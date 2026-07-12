import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import SectionHead from "@/components/SectionHead";
import { Rise } from "@/components/motion";
import { featuredProjects } from "@/lib/projects";

export default function SelectedWork() {
  const [a, b, c, d] = featuredProjects;
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
      <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-12">
        <Rise className="md:col-span-7">
          <ProjectCard project={a} aspect="aspect-[16/11]" />
        </Rise>
        <Rise delay={0.12} className="md:col-span-5 md:mt-28">
          <ProjectCard project={b} aspect="aspect-[4/5] md:aspect-[4/4.6]" />
        </Rise>
        <Rise className="md:col-span-5 md:-mt-10">
          <ProjectCard project={c} aspect="aspect-[4/5] md:aspect-[4/4.6]" />
        </Rise>
        <Rise delay={0.12} className="md:col-span-7 md:mt-16">
          <ProjectCard project={d} aspect="aspect-[16/11]" />
        </Rise>
      </div>
      <Rise className="mt-16 flex justify-center">
        <Button href="/work/" variant="ghost">
          Every project
        </Button>
      </Rise>
    </section>
  );
}
