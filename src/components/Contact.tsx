"use client";

import { useState, useEffect, useRef } from "react";
import { company, contactInterestOptions } from "@/data/content";
import { serviceSelectionEvent } from "@/lib/events";

export default function Contact() {
  const [selectedService, setSelectedService] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState("");
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
        setStatusMessage("Thank you! Your message has been sent successfully.");
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
      className="relative z-10 overflow-hidden flex min-h-screen flex-col justify-between px-4 sm:px-6 md:px-10 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 bg-[#101820]"
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
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
            data-reveal="true"
          >
            Let&apos;s <span className="text-gradient">talk.</span>
          </h2>
          <p className="mt-5 max-w-md text-muted leading-relaxed" data-reveal="true">
            Tell us about your project or business goals. Book a free consultation with our team or email us directly.
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

            <p>
              <a
                className="inline-flex items-center gap-2.5 font-medium text-text transition hover:text-brand"
                href={`tel:${company.phone}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-brand shrink-0"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{company.phone}</span>
              </a>
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="glass pointer-events-auto space-y-4 rounded-2xl p-4 sm:p-6 md:p-8"
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
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087FF5] to-[#0770db] px-6 py-3.5 font-semibold text-white shadow-[0_4px_20px_rgba(8,127,245,0.4)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(8,127,245,0.65)] hover:brightness-110 disabled:opacity-60 focus:outline-none"
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
                Our team will reach out to you shortly.
              </p>
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
