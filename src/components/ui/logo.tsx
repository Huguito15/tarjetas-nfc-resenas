import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-8 shrink-0 place-items-center rounded-[9px] bg-[linear-gradient(135deg,#3b82ff_0%,#1638b8_100%)] shadow-[0_6px_20px_-6px_rgb(59_130_255/0.7)] ring-1 ring-inset ring-white/20",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-full">
        <circle cx="10" cy="16" r="2.4" fill="#fff" />
        <path d="M15 11.5a6.4 6.4 0 0 1 0 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path
          d="M19.6 8.2a11 11 0 0 1 0 15.6"
          stroke="#fff"
          strokeOpacity="0.75"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24.2 5a15.6 15.6 0 0 1 0 22"
          stroke="#fff"
          strokeOpacity="0.45"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <a
      href="#inicio"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label={`${siteConfig.name}, ir al inicio`}
    >
      <LogoMark className="transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="whitespace-nowrap font-display text-[17px] font-semibold tracking-[-0.02em] text-fg">{siteConfig.name}</span>
    </a>
  );
}
