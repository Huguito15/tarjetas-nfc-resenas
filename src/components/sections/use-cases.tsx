import { useCases } from "@/data/content";

/** Cinta en movimiento con tipos de negocio (se detiene al pasar el ratón). */
export function UseCases() {
  const items = [...useCases, ...useCases];
  return (
    <section aria-labelledby="use-cases-title" className="relative border-y border-line bg-bg-soft/50 py-7">
      <div className="container-page flex flex-col items-center gap-5 md:flex-row md:gap-10">
        <h2 id="use-cases-title" className="shrink-0 text-sm font-medium text-muted">
          Pensada para negocios como
        </h2>
        <div className="relative w-full overflow-hidden mask-fade-x">
          <ul className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <li key={`${item}-${i}`} aria-hidden={i >= useCases.length ? true : undefined} className="pr-3">
                <span className="block whitespace-nowrap rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-fg/85">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
