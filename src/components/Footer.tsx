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
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>© 2026 {company.name}. All rights reserved.</span>
          <button
            onClick={scrollToTop}
            className="self-start transition hover:text-brand md:self-auto focus:outline-none"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
