"use client";

import { useState, useEffect, useRef } from "react";
import { company, contactInterestOptions } from "@/data/content";
import { serviceSelectionEvent } from "@/lib/events";

export default function Contact() {
  const [selectedService, setSelectedService] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // Listen for cross-component selections (e.g., from Services or Products)
    const unsubscribe = serviceSelectionEvent.subscribe((serviceName) => {
      setSelectedService(serviceName);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setStatus("sending");
    setErrors({});
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact" }),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        setStatus("sent");
        setStatusMessage("Thank you! Your message has been sent to our email and WhatsApp.");
        if (json.whatsappUrl) {
          setWhatsappUrl(json.whatsappUrl);
          // Try to launch WhatsApp chat in a new tab for instant connection
          try {
            window.open(json.whatsappUrl, "_blank");
          } catch {
            // Popup blocker may intercept window.open; the button is available as a fallback
          }
        }
        form.reset();
        setSelectedService("");
      } else {
        setStatus("error");
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setStatusMessage(json.error || "Something went wrong. Please try again.");
        }
      }
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please check your connection and try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-base md:text-sm text-text outline-none transition placeholder:text-muted focus:border-brand focus:ring-1 focus:ring-brand/40";

  return (
    <section
      id="contact"
      className="relative overflow-hidden flex min-h-screen flex-col justify-between px-5 pt-32 md:px-10"
    >
      {/* Ambient Tech Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Electric Blue Aurora (Behind Form) */}
        <div className="absolute top-1/4 -right-20 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.13)_0%,transparent_70%)] blur-3xl animate-pulse" />

        {/* Soft Cyan Aurora (Bottom Left) */}
        <div className="absolute bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Fine Technical Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "46px 46px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)",
          }}
        />

        {/* Technical Corner Markers */}
        <span className="absolute top-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute top-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2">
        {/* Left Column: Contact Copy and Info */}
        <div>
          <p className="eyebrow mb-4" data-reveal="true">
            Book a Free Consultation
          </p>
          <h2
            className="font-display text-4xl font-bold md:text-5xl"
            data-reveal="true"
          >
            Let&apos;s <span className="text-gradient">talk.</span>
          </h2>
          <p className="mt-5 max-w-md text-muted leading-relaxed" data-reveal="true">
            Tell us about your project or business goals. Book a free consultation with our team or message us directly on WhatsApp.
          </p>

          <div
            className="pointer-events-auto mt-8 space-y-4 text-muted"
            data-reveal="true"
          >
            <p>
              <a
                className="inline-flex items-center gap-2.5 font-medium text-text transition hover:text-brand"
                href={`mailto:${company.email}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-brand shrink-0"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{company.email}</span>
              </a>
            </p>

            {/* WhatsApp Contact Direct Action */}
            <p>
              <a
                className="inline-flex items-center gap-2.5 font-medium text-text transition hover:text-brand"
                href={company.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="text-brand shrink-0"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                </svg>
                <span>WhatsApp: {company.phone}</span>
                <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs text-brand">Quick Reply</span>
              </a>
            </p>

            <p className="flex items-center gap-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-brand shrink-0"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{company.address}</span>
            </p>

            <p>
              <a
                className="inline-flex items-center gap-2.5 transition hover:text-brand"
                href={company.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-brand shrink-0"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram {company.instagramHandle}</span>
              </a>
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="glass pointer-events-auto space-y-4 rounded-2xl p-6 md:p-8"
          data-reveal="true"
        >
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Your name *"
                required
                className={`${inputClass} ${errors.name ? "border-red-400" : ""}`}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="company" className="sr-only">
                Company
              </label>
              <input
                id="company"
                name="company"
                placeholder="Company (optional)"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address *"
                required
                className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone / WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="WhatsApp / Phone number"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="service" className="sr-only">
              I&apos;m interested in
            </label>
            <select
              id="service"
              name="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="" className="bg-obsidian text-muted">
                I&apos;m interested in… (optional)
              </option>
              {contactInterestOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-obsidian text-text">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us about your project or inquiry..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-hover shadow-md hover:shadow-brand/25 disabled:opacity-60 focus:outline-none"
          >
            {status === "sending" ? (
              <span>Booking consultation...</span>
            ) : (
              <span>Book a free consultation</span>
            )}
          </button>

          {status === "sent" && (
            <div className="mt-4 rounded-xl border border-brand/40 bg-brand/10 p-5 text-center animate-[fadeUp_.4s_ease-out]">
              <div className="flex items-center justify-center gap-2 text-brand font-semibold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>{statusMessage}</span>
              </div>
              <p className="mt-1.5 text-xs text-muted">
                Our team at <strong>+92 319 8669833</strong> has received your alert.
              </p>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110 shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          )}

          {status === "error" && statusMessage && (
            <p aria-live="polite" className="text-sm text-red-400">
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
