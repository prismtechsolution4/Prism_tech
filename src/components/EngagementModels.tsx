import { engagementModelsData } from "@/data/content";

export default function EngagementModels() {
  return (
    <section id="engagement" className="panel px-5 py-28 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          Engagement models
        </p>
        <h2
          className="font-display max-w-2xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Work with us the way that <span className="text-gradient">fits you</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {engagementModelsData.map((model) => (
            <div key={model.title} data-reveal="true">
              <div className="spotlight glass pointer-events-auto rounded-2xl h-full p-8 flex flex-col justify-between">
                <div className="relative">
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {model.title}
                  </h3>
                  <p className="mt-3 text-muted leading-relaxed">
                    {model.description}
                  </p>

                  <ul className="mt-5 space-y-2 text-sm text-text/90">
                    {model.points.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 border-t border-white/10 pt-4 text-sm font-medium text-brand">
                    {model.footer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
