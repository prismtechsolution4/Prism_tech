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
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand";

  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col justify-between px-5 pt-32 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2">
        {/* Left Column: Contact Copy and Info */}
        <div>
          <p className="eyebrow mb-4" data-reveal="true">
            Contact
          </p>
          <h2
            className="font-display text-4xl font-bold md:text-5xl"
            data-reveal="true"
          >
            Not sure where to start?{" "}
            <span className="text-gradient">Let&apos;s talk.</span>
          </h2>
          <p className="mt-5 max-w-md text-muted leading-relaxed" data-reveal="true">
            Tell us what you&apos;re trying to achieve. We&apos;ll reply with a clear next
            step, whether that&apos;s a discovery call, a proposal, or a quick answer.
          </p>

          <div
            className="pointer-events-auto mt-8 space-y-3 text-muted"
            data-reveal="true"
          >
            <p>
              <a
                className="transition hover:text-brand"
                href={`mailto:${company.email}`}
              >
                {company.email}
              </a>
            </p>
            <p>{company.address}</p>
            <p>
              <a
                className="transition hover:text-brand"
                href={company.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram {company.instagramHandle}
              </a>
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="glass pointer-events-auto space-y-4 rounded-2xl p-6"
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
                placeholder="Your name"
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

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              required
              className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
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
              rows={5}
              placeholder="Tell us about your project"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-60 focus:outline-none"
          >
            {status === "sending" ? "Sending message..." : "Send message"}
          </button>

          {status === "sent" && (
            <p aria-live="polite" className="text-sm text-brand font-medium">
              {statusMessage}
            </p>
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
