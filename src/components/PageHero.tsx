import { MaskLines, Rise } from "@/components/motion";

export default function PageHero({
  eyebrow,
  lines,
  intro,
}: {
  eyebrow: string;
  lines: React.ReactNode[];
  intro?: React.ReactNode;
}) {
  return (
    <header className="shell pt-40 pb-16 md:pt-48 md:pb-20">
      <Rise>
        <p className="eyebrow mb-8">{eyebrow}</p>
      </Rise>
      <MaskLines
        as="h1"
        className="display display-hero max-w-5xl"
        delay={0.1}
        eager
        lines={lines}
      />
      {intro && (
        <Rise delay={0.3}>
          <p className="mt-10 max-w-xl text-lg text-ash">{intro}</p>
        </Rise>
      )}
    </header>
  );
}
