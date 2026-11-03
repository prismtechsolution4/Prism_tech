# Intechtive Solutions (PVT) LTD — Official Website

High-performance, pixel-precise rebuild of [Intechtive Solutions](https://intechtivesolutions.com/) ("Intelligence + Technology").

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🎨 Centralized Design System (`src/styles/theme.css`)

All colors, typography, border radii, and shadows live in **one centralized file**: [`src/styles/theme.css`](./src/styles/theme.css).

- **Zero Hardcoded Colors**: No hex, rgb, or hsl values exist across components, CSS modules, or classes.
- **Single Brand Control**: Changing `--color-primary` in `theme.css` instantly updates all accents, buttons, glows, timelines, icons, and gradients across the entire site.
- **Tailwind Integration**: All CSS variables are mapped directly in [`tailwind.config.ts`](./tailwind.config.ts).

### Core Palette
- **Background (Obsidian)**: `#05080a` (`var(--color-bg)`)
- **Primary Brand (Green)**: `#7ed33f` (`var(--color-primary)`)
- **Accent (Cyber Cyan)**: `#22e5ff` (`var(--color-accent)`)
- **Text (Ink)**: `#e8f1ee` (`var(--color-text)`)
- **Muted Text**: `#8ba19a` (`var(--color-text-muted)`)

---

## 🚀 Features & Page Structure

1. **Preloader**: Logo with percentage counter counting 0% → 100% with smooth fade-out.
2. **Top Scroll Progress Bar**: Gradient indicator tracking scroll depth.
3. **Sticky Navbar**: Brand logo, smooth-scroll links, "Get in touch" CTA, and responsive mobile hamburger drawer.
4. **Hero Section**: H1 "Intelligence + Technology, engineered for what's next.", subcopy, CTAs, and scroll indicator.
5. **Infinite Marquee Ticker**: Continuous seamless looping banner with pause-on-hover and accessibility support.
6. **Why Intechtive (Stats)**: Interactive spotlight cards with animated count-up numbers:
   - 4 Core service lines
   - 5 Ready-made products
   - 3 Platforms: web, mobile & desktop
   - 24/7 Remote security monitoring
7. **What We Do (Services)**: Interactive canvas-based node network synchronized with expandable service accordion. Clicking nodes or list items selects the service; "Enquire about X →" pre-selects that service in the contact form.
8. **How We Work (Process)**: 6-step interactive timeline with scroll-linked gradient line and active step indicators.
9. **Tech Stack**: Categorized cards (Web & Frontend, Backend & APIs, Mobile) with official tech SVG icons and hover elevations.
10. **Our Products**: Array-driven product showcase featuring auto-rotating image carousel and clickable thumbnails for HRMS (extendable to POS, Reward App, CRM, E-commerce).
11. **Engagement Models**: Cards for "We build it for you" and "Dedicated team".
12. **Infrastructure Services**: "Remote Security Monitoring", "Camera Installation", and "Inventory Management" with enquiry links.
13. **FAQ**: Accessible accordion with animated rotate toggles.
14. **Contact Form & API**: Full validation with **Zod**, honeypot spam protection, pre-selected service dropdown, and SMTP email delivery with **Nodemailer** via `/api/contact`.
15. **Footer**: Navigation columns, copyright, Instagram link, and "Back to top ↑" smooth scroll button.
16. **Floating "Let's Talk" CTA & Modal**: Floating bottom-right action button triggering lead capture modal dialog with keyboard accessibility (Escape to close, autofocus, backdrop dismiss).

---

## 🛠️ Project Structure

```
├── public/
│   ├── brand/               # Brand logos
│   ├── tech/                # Tech stack SVG icons
│   ├── products/            # Product screenshots & galleries
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── api/contact/     # Contact API endpoint (Zod + Nodemailer)
│   │   ├── layout.tsx       # Root layout, Google fonts, SEO metadata
│   │   └── page.tsx         # Single-page layout
│   ├── components/          # Modular component per section
│   │   ├── Contact.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── EngagementModels.tsx
│   │   ├── FAQ.tsx
│   │   ├── FloatingTalk.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Infrastructure.tsx
│   │   ├── InteractiveBackground.tsx
│   │   ├── LeadPopup.tsx
│   │   ├── Marquee.tsx
│   │   ├── Navbar.tsx
│   │   ├── NodeNetwork.tsx
│   │   ├── Preloader.tsx
│   │   ├── Process.tsx
│   │   ├── Products.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Services.tsx
│   │   ├── TechStack.tsx
│   │   └── WhyIntechtive.tsx
│   ├── data/
│   │   └── content.ts       # Central content store (edit copy without touching components)
│   ├── lib/
│   │   ├── events.ts        # Smooth scroll & service selection emitter
│   │   └── useSpotlight.ts  # Dynamic card spotlight mouse tracker
│   ├── styles/
│   │   ├── globals.css      # Base styling and glassmorphism utilities
│   │   └── theme.css        # Centralized theme tokens
│   └── types/
│       └── index.ts         # TypeScript definitions
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 24)
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your SMTP provider credentials for contact form submissions.

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm start
```
