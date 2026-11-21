import {
  CompanyInfo,
  ServiceItem,
  ProductItem,
  SecurityItem,
  ProcessStep,
  TechCategory,
  EngagementModel,
  FAQItem,
  StatItem,
} from "@/types";

export const company: CompanyInfo = {
  name: "PrismTech Solutions (PVT) LTD",
  tagline: "Software, AI and enterprise digital systems that help businesses run smarter, faster and scale.",
  email: "info@prismtechsolutions.com",
  phone: "+92 319 8669833",
  whatsappNumber: "03198669833",
  whatsapp: "https://wa.me/923198669833",
  address: "",
  instagram: "",
  instagramHandle: "",
};

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Products", href: "#products" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export const marqueeItems = [
  "Consultancy",
  "Web Applications",
  "Mobile Apps",
  "Desktop Software",
  "Custom AI Projects",
  "Social Media Marketing",
  "Cloud Infrastructure",
  "HRMS",
  "POS",
  "Reward App",
  "CRM",
  "E-commerce",
  "DevOps & CI/CD",
  "Enterprise Architecture",
];

export const statsData: StatItem[] = [
  {
    target: 4,
    label: "Core service lines",
  },
  {
    target: 5,
    label: "Ready-made products",
  },
  {
    target: 3,
    label: "Platforms: web, mobile & desktop",
  },
  {
    target: 24,
    isCustomDisplay: true,
    displayValue: "/7",
    label: "DevOps & cloud support",
  },
];

export const servicesData: ServiceItem[] = [
  {
    id: "consultancy",
    number: "01",
    title: "Consultancy",
    blurb: "Strategy that turns technology into advantage.",
    points: [
      "Digital transformation roadmaps",
      "Architecture & technology audits",
      "Process automation advisory",
    ],
  },
  {
    id: "software",
    number: "02",
    title: "Software Development",
    blurb: "Mobile, web and desktop applications engineered to scale.",
    points: [
      "Native & cross-platform mobile apps",
      "Web platforms & portals",
      "Desktop & enterprise software",
    ],
  },
  {
    id: "ai",
    number: "03",
    title: "Custom AI Projects",
    blurb: "AI-based projects built around your data and your workflows.",
    points: [
      "Machine-learning & prediction models",
      "Conversational and vision AI",
      "AI features embedded in your products",
    ],
  },
  {
    id: "marketing",
    number: "04",
    title: "Social Media Marketing",
    blurb: "Campaigns and content that grow your audience and bring customers to you.",
    points: [
      "Social media strategy & content planning",
      "Paid campaigns and audience growth",
      "Performance reporting and optimisation",
    ],
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discover & listen",
    text: "We start with your goals, users and constraints so we solve the right problem before writing a line of code.",
  },
  {
    step: 2,
    title: "Plan & architect",
    text: "Scope, milestones and a technical blueprint, so you know what gets built, in what order, and how it will scale.",
  },
  {
    step: 3,
    title: "Design",
    text: "Clear, usable interfaces and flows, reviewed with you before development begins.",
  },
  {
    step: 4,
    title: "Build & integrate",
    text: "Iterative development with regular demos, connecting your systems, data and devices as we go.",
  },
  {
    step: 5,
    title: "Test & launch",
    text: "Quality checks, performance tuning and a controlled rollout, with training for your team.",
  },
  {
    step: 6,
    title: "Support & scale",
    text: "Monitoring, maintenance and improvements as your business grows.",
  },
];

export const techStackData: TechCategory[] = [
  {
    title: "Web & Frontend",
    description: "Fast, responsive interfaces and web apps.",
    items: [
      { name: "Angular", icon: "/tech/angular.svg" },
      { name: "React", icon: "/tech/react.svg" },
      { name: "Next.js", icon: "/tech/nextdotjs.svg" },
    ],
  },
  {
    title: "Backend & APIs",
    description: "Secure, scalable services and integrations.",
    items: [
      { name: "ASP.NET", icon: "/tech/dotnet.svg" },
      { name: "Java", icon: "/tech/openjdk.svg" },
      { name: "Python", icon: "/tech/python.svg" },
      { name: "Node.js", icon: "/tech/nodedotjs.svg" },
    ],
  },
  {
    title: "Mobile",
    description: "Native and cross-platform apps for every device.",
    items: [
      { name: "Flutter", icon: "/tech/flutter.svg" },
      { name: "React Native", icon: "/tech/react.svg" },
      { name: "Android", icon: "/tech/android.svg" },
      { name: "iOS", icon: "/tech/ios.svg" },
    ],
  },
];

export const productsData: ProductItem[] = [
  {
    id: "hrms",
    name: "HRMS Platform",
    tag: "Workforce & Talent Engine",
    blurb: "Enterprise-grade attendance tracking, multi-tier salary payroll, biometric sync and self-service employee portal.",
    color: "#087FF5",
    image: "/products/hrms-ui.jpg",
    gallery: [
      "/products/hrms-ui.jpg",
    ],
    metrics: [
      { label: "Payroll Processing", value: "< 3 mins" },
      { label: "Attendance Precision", value: "99.9%" },
      { label: "Compliance Ready", value: "100%" },
    ],
    features: [
      { title: "Biometric & Geofence Clock-in", desc: "Live device sync with instant overtime and late anomaly detection." },
      { title: "Automated Tax & Salary Engine", desc: "One-click batch payroll generation with statutory tax calculations." },
      { title: "Employee Self-Service Hub", desc: "Leave requests, payslip downloads, and asset requests on web and mobile." },
    ],
    badges: ["Biometric Sync", "Cloud & On-Prem", "Mobile Apps", "Role-Based RBAC"],
  },
  {
    id: "pos",
    name: "POS & Retail Suite",
    tag: "Point of Sale & Stock",
    blurb: "Lightning-fast barcode checkout, live multi-branch inventory sync, offline-mode resilience and fiscal receipting.",
    color: "#38bdf8",
    image: "/products/pos-ui.jpg",
    gallery: [
      "/products/pos-ui.jpg",
    ],
    metrics: [
      { label: "Barcode Scan Speed", value: "0.15s" },
      { label: "Stock Sync Latency", value: "< 1 sec" },
      { label: "Offline Resilience", value: "24/7" },
    ],
    features: [
      { title: "Ultra-Fast Touch Checkout", desc: "Designed for high peak volume with keyboard shortcuts & scanner integration." },
      { title: "Centralized Multi-Warehouse", desc: "Low-stock alerts, auto purchase-orders, and inter-branch inventory transfers." },
      { title: "Split Tender & Card Payment", desc: "Seamless support for cash, card swipe, QR wallets, and split bills." },
    ],
    badges: ["Offline Mode", "Multi-Branch", "Thermal Printing", "Live Analytics"],
  },
  {
    id: "reward",
    name: "Reward & Loyalty App",
    tag: "Retention & Customer CRM",
    blurb: "White-label mobile loyalty platform that turns one-time shoppers into lifelong brand advocates through gamified perks.",
    color: "#087FF5",
    image: "/products/reward-ui.jpg",
    gallery: [
      "/products/reward-ui.jpg",
    ],
    metrics: [
      { label: "Retention Uplift", value: "+38%" },
      { label: "QR Scan Redemption", value: "Instant" },
      { label: "Push Open Rate", value: "4.8x" },
    ],
    features: [
      { title: "Tiered VIP Status & Points", desc: "Gamified Silver, Gold and Platinum tiers with custom spend multiplier rules." },
      { title: "Contactless QR Code Vouchers", desc: "One-tap scan at cashier terminals to redeem discounts or free gifts." },
      { title: "Triggered Push Notifications", desc: "Re-engage dormant customers on birthdays and post-visit milestones automatically." },
    ],
    badges: ["iOS & Android", "QR Generator", "Gamified Badges", "Custom White-Label"],
  },
  {
    id: "crm",
    name: "Enterprise CRM",
    tag: "Sales Pipeline & Leads",
    blurb: "Intelligent sales pipeline management, automated WhatsApp lead captures, deal forecasting and omnichannel timeline.",
    color: "#38bdf8",
    image: "/products/crm-ui.jpg",
    gallery: [
      "/products/crm-ui.jpg",
    ],
    metrics: [
      { label: "Close Rate Boost", value: "+27%" },
      { label: "Lead Response Time", value: "< 2 mins" },
      { label: "Pipeline Visibility", value: "360°" },
    ],
    features: [
      { title: "Kanban Visual Deal Pipeline", desc: "Drag-and-drop deals across custom stages with probability-weighted revenue." },
      { title: "Omnichannel Communications", desc: "Sync calls, WhatsApp, emails, and meetings in a single unified audit log." },
      { title: "Automated Task & Follow-up Rules", desc: "Never lose a lead with auto-assigned reminders and escalation triggers." },
    ],
    badges: ["WhatsApp Sync", "Pipeline Analytics", "Lead Scoring", "RESTful API"],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Engine",
    tag: "Online Store & Logistics",
    blurb: "Headless, ultra-fast online storefront with sub-second page loads, automated payment gateway integration and courier dispatch.",
    color: "#087FF5",
    image: "/products/ecommerce-ui.jpg",
    gallery: [
      "/products/ecommerce-ui.jpg",
    ],
    metrics: [
      { label: "Lighthouse Performance", value: "98/100" },
      { label: "Checkout Conversion", value: "4.2%" },
      { label: "Cart Abandonment Drop", value: "-24%" },
    ],
    features: [
      { title: "Sub-Second Modern Storefront", desc: "Engineered with Next.js for instant page loads and peak search SEO ranking." },
      { title: "Payment & Courier Integrations", desc: "Pre-integrated credit cards, bank transfers, COD, and auto courier booking." },
      { title: "Real-time Order & Stock Sync", desc: "Synchronizes inventory instantly across your physical stores and online shop." },
    ],
    badges: ["Headless Next.js", "COD & Card", "Courier API", "Multi-Currency"],
  },
];

export const engagementModelsData: EngagementModel[] = [
  {
    title: "We build it for you",
    description: "Defined scope, clear milestones and a delivery team that owns the outcome from design to launch.",
    points: [
      "Web, mobile or desktop products",
      "Custom AI features",
      "Fixed scope with milestone reviews",
    ],
    footer: "Best for new products and well-defined projects.",
  },
  {
    title: "Dedicated team",
    description: "Extend your own team with engineers and designers who work to your roadmap and priorities.",
    points: [
      "Flexible capacity as needs change",
      "Long-term product evolution",
      "Direct collaboration with your staff",
    ],
    footer: "Best for ongoing roadmaps and growing products.",
  },
];

export const securityServicesData: SecurityItem[] = [
  {
    title: "Cloud & DevOps Infrastructure",
    text: "High-availability cloud architecture, automated CI/CD deployment pipelines, containerization, and zero-downtime microservice orchestration.",
  },
  {
    title: "Cybersecurity & Data Protection",
    text: "Enterprise role-based access control (RBAC), end-to-end data encryption, API security hardening, and vulnerability mitigation.",
  },
  {
    title: "Inventory & ERP Systems",
    text: "Keep stock accurate and under control, from a single store to a full online portal, with real-time levels, supplier and reorder tracking, and reports tied to sales.",
  },
];

export const faqsData: FAQItem[] = [
  {
    q: "What does PrismTech Solutions do?",
    a: "We provide consultancy, custom software development (mobile, web and desktop), custom AI projects, social media marketing, inventory & ERP management, ready-made products (HRMS, POS, Reward App, CRM, and an E-commerce platform), and cloud infrastructure management.",
  },
  {
    q: "Do you build custom software or only sell ready-made products?",
    a: "Both. Our products can be deployed and tailored to your business, and if you need something unique we design and build it from scratch.",
  },
  {
    q: "How do you ensure software security and cloud reliability?",
    a: "We architect all systems with enterprise-grade security, end-to-end data encryption, automated CI/CD deployment pipelines, and high-availability cloud hosting with 99.9% uptime.",
  },
  {
    q: "How do we get started?",
    a: "Send us a message or email us. We'll arrange a discovery conversation, learn about your goals, and follow up with a proposed approach.",
  },
  {
    q: "How long does a project take and what does it cost?",
    a: "It depends on scope. After discovery we provide a clear estimate of timeline and budget before any work begins.",
  },
];

export const contactInterestOptions = [
  "Consultancy",
  "Software Development",
  "Custom AI Projects",
  "Social Media Marketing",
  "HRMS",
  "POS",
  "Reward App",
  "CRM",
  "E-commerce Platform",
  "Cloud & DevOps Infrastructure",
  "Cybersecurity & Data Protection",
  "Inventory Management",
  "Something else",
];

export const footerLinks = {
  Company: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ],
  Products: [
    { label: "HRMS", href: "#products" },
    { label: "POS", href: "#products" },
    { label: "Reward App", href: "#products" },
    { label: "CRM", href: "#products" },
    { label: "E-commerce", href: "#products" },
  ],
};
