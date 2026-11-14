"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { contactInterestOptions } from "@/data/content";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export default function LeadPopup({
  isOpen,
  onClose,
  defaultService = "",
}: LeadPopupProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [service, setService] = useState(defaultService);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (defaultService) {
      setService(defaultService);
    }
  }, [defaultService]);

  useEffect(() => {
    if (isOpen) {
      nameInputRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setStatus("sending");
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "popup" }),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        setStatus("sent");
        if (json.whatsappUrl) {
          setWhatsappUrl(json.whatsappUrl);
          try {
            window.open(json.whatsappUrl, "_blank");
          } catch {
            // Popup blocker fallback
          }
        }
        try {
          localStorage.setItem("prismtech-lead-popup", "submitted");
        } catch {
          // Ignore localStorage errors
        }
      } else {
        setStatus("error");
        if (json.errors) {
          setErrors(json.errors);
        }
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand focus:ring-1 focus:ring-brand/40";

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-[fadeUp_.4s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
        className="glass relative w-full max-w-md rounded-xl p-7 shadow-popup"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-muted transition hover:text-white focus:outline-none"
        >
          ✕
        </button>

        <Image
          src="/brand/logo-transparent.png"
          alt="PrismTech Solutions"
          width={640}
          height={160}
          className="h-9 w-auto"
        />

        {status === "sent" ? (
          <div className="py-8 text-center" aria-live="polite">
            <p className="font-display text-2xl font-semibold text-brand">
              Inquiry Sent!
            </p>
            <p className="mt-2 text-muted text-sm leading-relaxed">
              We&apos;ve dispatched your inquiry to our email and WhatsApp (+92 319 8669833).
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110 shadow-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            )}
            <div className="mt-4">
              <button
                onClick={onClose}
                className="text-xs text-muted hover:text-white underline"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2
              id="lead-title"
              className="font-display mt-5 text-2xl font-bold text-white"
            >
              Looking for something{" "}
              <span className="text-gradient">specific?</span>
            </h2>
            <p className="mt-2 text-sm text-muted">
              Leave your details and we&apos;ll get back to you with the right
              information.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div>
                <label htmlFor="lp-name" className="sr-only">
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  id="lp-name"
                  name="name"
                  autoComplete="name"
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
                <label htmlFor="lp-email" className="sr-only">
                  Email
                </label>
                <input
                  id="lp-email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                <label htmlFor="lp-phone" className="sr-only">
                  Phone
                </label>
                <input
                  id="lp-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Phone (optional)"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="lp-service" className="sr-only">
                  Interested in
                </label>
                <select
                  id="lp-service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
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

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover shadow-md hover:shadow-brand/25 disabled:opacity-60 focus:outline-none"
              >
                {status === "sending" ? "Sending..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
