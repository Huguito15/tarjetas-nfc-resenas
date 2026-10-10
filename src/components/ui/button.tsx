import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] transition-[translate,scale,background-color,border-color,color,box-shadow] duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "btn-primary hover:-translate-y-0.5",
  secondary:
    "border border-line-strong bg-surface/60 text-fg backdrop-blur-md hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent-soft",
  ghost: "text-muted hover:bg-accent-soft hover:text-fg",
  /** Para fondos oscuros fijos (igual en modo claro y oscuro). */
  onDark: "border border-white/20 bg-white/5 text-white backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/10",
};

// Nota: `className` se añade al final, pero no sustituye utilidades del mismo tipo
// (p. ej. display o color). Para cambiar el aspecto, usa una variante.

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-[15px] sm:text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={buttonStyles({ variant, size, className })} {...props} />;
}
