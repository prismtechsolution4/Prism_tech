import Image from "next/image";
import { techStackData } from "@/data/content";

export default function TechStack() {
  return (
    <section id="tech" className="panel px-5 py-28 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          Tech stack
        </p>
        <h2
          className="font-display max-w-2xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          The right tools for <span className="text-gradient">every build</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted" data-reveal="true">
          Our team works across modern web, backend and mobile technologies, so
          we choose what fits your product, not what fits our habits.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {techStackData.map((category) => (
            <div key={category.title} data-reveal="true">
              <div className="spotlight glass pointer-events-auto rounded-2xl h-full p-7">
                <div className="relative">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {category.description}
                  </p>

                  <ul className="mt-6 grid grid-cols-2 gap-3">
                    {category.items.map((tech) => (
                      <li
                        key={tech.name}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/90 transition hover:-translate-y-0.5 hover:border-brand/60 hover:bg-white/10"
                      >
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={28}
                          height={28}
                          className="h-7 w-7 shrink-0 transition group-hover:scale-110"
                        />
                        <span>{tech.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
