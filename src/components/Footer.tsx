"use client";

import Image from "next/image";
import { company, footerLinks } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pointer-events-auto relative w-full mt-16 sm:mt-24 bg-obsidian px-4 sm:px-6 md:px-10">
      {/* Top divider gradient from brand to transparent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="mx-auto max-w-7xl py-12 sm:py-14">
        <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand Info Column */}
          <div>
            <Image
              src="/brand/logo-transparent.png"
              alt="PrismTech Solutions"
              width={640}
              height={160}
              className="h-14 md:h-16 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {company.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PrismTech Solutions on LinkedIn"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#94A3B8] transition-all duration-300 hover:border-[#087FF5]/60 hover:bg-[#087FF5]/15 hover:text-[#087FF5] hover:shadow-[0_0_15px_rgba(8,127,245,0.3)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="eyebrow mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-muted">
              {footerLinks.Company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="transition hover:translate-x-0.5 hover:text-white focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="eyebrow mb-5">Products</h4>
            <ul className="space-y-3 text-sm text-muted">
              {footerLinks.Products.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href, link.label)}
                    className="transition hover:translate-x-0.5 hover:text-white focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="eyebrow mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  className="transition hover:text-white"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-white"
                  href={`tel:${company.phone}`}
                >
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-2 transition hover:text-[#087FF5]"
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#087FF5] shrink-0">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>© 2026 {company.name}. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a
              href={company.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-[#087FF5]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <button
              onClick={scrollToTop}
              className="self-start transition hover:text-brand md:self-auto focus:outline-none"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
