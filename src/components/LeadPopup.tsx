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
        try {
          localStorage.setItem("prismtech-lead-popup", "submitted");
        } catch {
          // Ignore localStorage errors
        }
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 2200);
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
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand";

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
        className="glass relative w-full max-w-md rounded-2xl p-7 shadow-popup"
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
          width={889}
          height={354}
          className="h-10 w-auto"
        />

        {status === "sent" ? (
          <div className="py-10 text-center" aria-live="polite">
            <p className="font-display text-2xl font-semibold text-brand">
              Thank you!
            </p>
            <p className="mt-2 text-muted text-sm">
              We&apos;ve received your details and will be in touch shortly.
            </p>
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
                className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-60 focus:outline-none"
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
