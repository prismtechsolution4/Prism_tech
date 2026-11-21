"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { company, contactInterestOptions } from "@/data/content";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  isAction?: boolean;
}

export default function FloatingTalk() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState(""); // phone or email
  const [messageText, setMessageText] = useState("");
  const [step, setStep] = useState<"select_topic" | "enter_details" | "sent">("select_topic");
  const [isSending, setIsSending] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initial bot greetings
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([
      {
        id: "1",
        sender: "bot",
        text: "Hi there! 👋 Welcome to Prism Tech Solution.",
        time: now,
      },
      {
        id: "2",
        sender: "bot",
        text: "How can we assist you today? Select a service or send a direct project inquiry to our team:",
        time: now,
      },
    ]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, step]);

  const handleSelectTopic = (service: string) => {
    setSelectedService(service);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: `Interested in: ${service}`,
        time: now,
      },
      {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `Great choice! Please share your name and contact details below. Our technical consulting team will get back to you immediately!`,
        time: now,
      },
    ]);

    setStep("enter_details");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    setIsSending(true);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const isEmail = contactInfo.includes("@");
    const payload = {
      name: name.trim(),
      email: isEmail ? contactInfo.trim() : "",
      phone: !isEmail ? contactInfo.trim() : "",
      service: selectedService || "General Project Inquiry",
      message: messageText.trim() || `Inquiry from website regarding ${selectedService || "Prism Tech Solution services"}`,
      source: "chatbot",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        const directWaUrl = json.whatsappUrl || `https://wa.me/923198669833?text=${encodeURIComponent(`Hi Prism Tech Solution, I am ${name}. ${payload.message}`)}`;
        setWhatsappUrl(directWaUrl);
        setStep("sent");

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "user",
            text: `${payload.message} (${name} • ${contactInfo})`,
            time: now,
          },
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: `✅ Thank you ${name}! Your inquiry has been dispatched to our engineering team. You can also chat directly on WhatsApp if you prefer:`,
            time: now,
            isAction: true,
          },
        ]);
      } else {
        alert(json.error || "Failed to deliver message. Please try again or reach out directly.");
      }
    } catch {
      alert("Network error. Please reach out to our team at +92 319 8669833.");
    } finally {
      setIsSending(false);
    }
  };

  const quickTopics = [
    "Software Development",
    "Custom AI Projects",
    "HRMS / CRM / POS",
    "Security & Infrastructure",
    "Mobile Applications",
    "General Inquiry",
  ];

  return (
    <div className="pointer-events-auto fixed right-3 bottom-3 z-50 sm:right-6 sm:bottom-6 md:right-8 md:bottom-8">
      {/* Main Floating "Let's talk" Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Let's talk"
          className="group relative flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-[#087FF5] to-[#0770db] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_6px_24px_-2px_rgba(8,127,245,0.55)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(8,127,245,0.75)] hover:brightness-110 focus:outline-none"
        >
          {/* Pulsing theme-colored indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#101820] bg-[#087FF5]" />
          </span>

          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="tracking-wide">Let&apos;s talk</span>
        </button>
      )}

      {/* Expanded Let's Talk Inquiry Window */}
      {isOpen && (
        <div className="flex h-[min(540px,calc(100svh-5rem))] w-[calc(100vw-1.5rem)] sm:w-[360px] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#101820] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-[fadeUp_.3s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#101820] via-[#15202b] to-[#101820] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 shadow-inner">
                <Image
                  src="/brand/logo-icon.png"
                  alt="PrismTech Logo"
                  width={26}
                  height={26}
                  className="h-6 w-6 object-contain"
                />
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-black bg-[#087FF5]" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Prism Tech Solution</span>
                  <span className="text-[#38bdf8]">✓</span>
                </h3>
                <p className="text-[11px] text-[#A0AEC0]">
                  Online • Technical Advisory Team
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#A0AEC0] transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    m.sender === "user"
                      ? "rounded-tr-none bg-gradient-to-r from-[#087FF5] to-[#0770db] text-white font-medium shadow-[0_2px_12px_rgba(8,127,245,0.3)]"
                      : "rounded-tl-none border border-white/10 bg-[#15202b] text-white"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.isAction && whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087FF5] to-[#0770db] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 shadow-[0_4px_16px_rgba(8,127,245,0.4)]"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                      </svg>
                      <span>Continue to WhatsApp</span>
                    </a>
                  )}
                </div>
                <span className="mt-1 px-1 text-[10px] text-[#687386]">{m.time}</span>
              </div>
            ))}

            {/* Quick Topic Chips */}
            {step === "select_topic" && (
              <div className="pt-2">
                <p className="mb-2 text-[11px] font-medium text-[#A0AEC0]">Select an area of interest:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleSelectTopic(topic)}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-white transition-all duration-200 hover:border-[#087FF5] hover:bg-[#087FF5]/15 hover:text-[#087FF5]"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Form */}
          <div className="border-t border-white/10 bg-[#0d1419] p-3">
            {step === "enter_details" && (
              <form onSubmit={handleSendMessage} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name *"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-base sm:text-xs text-white outline-none placeholder:text-[#687386] focus:border-[#087FF5]"
                  />
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Phone / Email *"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-base sm:text-xs text-white outline-none placeholder:text-[#687386] focus:border-[#087FF5]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Describe your requirements for ${selectedService}...`}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-base sm:text-xs text-white outline-none placeholder:text-[#687386] focus:border-[#087FF5]"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087FF5] to-[#0770db] py-2.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 shadow-[0_4px_16px_rgba(8,127,245,0.4)] disabled:opacity-50"
                >
                  <span>{isSending ? "Dispatching Inquiry..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}

            {step === "select_topic" && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Or type a direct inquiry here..."
                  onFocus={() => setStep("enter_details")}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base sm:text-xs text-white outline-none placeholder:text-[#687386] focus:border-[#087FF5]"
                />
                <button
                  onClick={() => setStep("enter_details")}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087FF5] text-white transition hover:brightness-110"
                >
                  →
                </button>
              </div>
            )}

            {step === "sent" && (
              <div className="flex items-center justify-between text-xs text-[#A0AEC0]">
                <span>Inquiry successfully delivered</span>
                <button
                  onClick={() => {
                    setStep("select_topic");
                    setSelectedService("");
                    setMessageText("");
                  }}
                  className="text-[#087FF5] hover:underline"
                >
                  New inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
