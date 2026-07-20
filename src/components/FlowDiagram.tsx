/**
 * An animated data-flow: node pills connected by live corona currents.
 * Pure CSS animation (see .flow-link) — cheap, responsive, honest about
 * reduced motion. Wraps gracefully on small screens.
 */
export default function FlowDiagram({
  steps,
  className = "",
}: {
  steps: string[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-y-3 ${className}`}
      role="img"
      aria-label={`Workflow: ${steps.join(", then ")}`}
    >
      {steps.map((step, i) => (
        <span key={step + i} className="flex items-center">
          <span
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.72rem] font-medium tracking-wide ${
              i === steps.length - 1
                ? "border-corona-soft/60 text-corona-soft light-rim"
                : "border-hairline bg-night/60 text-moon/85"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <span aria-hidden className="flow-link mx-1.5 h-px w-5 shrink-0 sm:w-8" />
          )}
        </span>
      ))}
    </div>
  );
}
