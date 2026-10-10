import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      <p
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent",
        )}
      >
        <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]" aria-hidden />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-5 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-[2.6rem] lg:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-5 text-base leading-relaxed text-muted text-pretty sm:text-lg", centered && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
