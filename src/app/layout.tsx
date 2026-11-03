import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intechtive Solutions (PVT) LTD — Intelligence + Technology",
  description:
    "Consultancy, software development (mobile, web, desktop), custom AI, HRMS, POS, Reward App, CRM, and remote security monitoring.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Intechtive Solutions (PVT) LTD — Intelligence + Technology",
    description:
      "Consultancy, software development (mobile, web, desktop), custom AI, HRMS, POS, Reward App, CRM, and remote security monitoring.",
    url: "https://intechtivesolutions.com",
    siteName: "Intechtive Solutions (PVT) LTD",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intechtive Solutions (PVT) LTD — Intelligence + Technology",
    description:
      "Consultancy, software development (mobile, web, desktop), custom AI, HRMS, POS, Reward App, CRM, and remote security monitoring.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased selection:bg-brand/35 selection:text-white">
        {/* Ambient background scrim */}
        <div className="page-scrim pointer-events-none fixed inset-0 z-[5]" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
