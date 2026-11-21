import { marqueeItems } from "@/data/content";

export default function Marquee() {
  // Duplicated list for seamless infinite loop
  const duplicatedItems = [...marqueeItems, ...marqueeItems];

  return (
    <div
      className="marquee pointer-events-auto overflow-hidden border-y border-white/10 bg-obsidian py-3.5 sm:py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      aria-label="What we do"
    >
      <div className="marquee-track">
        {duplicatedItems.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="font-display flex items-center text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.25em] whitespace-nowrap text-muted uppercase md:text-base"
          >
            {item}
            <span
              className="mx-5 sm:mx-8 h-1.5 w-1.5 rotate-45 bg-brand/80"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
