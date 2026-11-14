"use client";

import Image from "next/image";
import { company, footerLinks } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pointer-events-auto relative -mx-5 mt-24 bg-obsidian px-5 md:-mx-10 md:px-10">
      {/* Top divider gradient from brand to transparent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="mx-auto max-w-7xl py-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand Info Column */}
          <div>
            <Image
              src="/brand/logo-transparent.png"
              alt="PrismTech Solutions"
              width={640}
              height={160}
              className="h-12 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {company.tagline}
            </p>
            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PrismTech Solutions on Instagram"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-muted transition hover:border-brand hover:text-brand"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
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
                  className="inline-flex items-center gap-2 transition hover:text-brand"
                  href={company.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="text-brand shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                  </svg>
                  <span>{company.phone} (WhatsApp)</span>
                </a>
              </li>
              <li>{company.address}</li>
              <li>
                <a
                  className="transition hover:text-white"
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.instagramHandle}
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
