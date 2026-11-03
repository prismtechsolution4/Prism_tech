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
  name: "Intechtive Solutions (PVT) LTD",
  tagline: "Software, AI and security systems that help businesses run smarter, faster and safer.",
  email: "info@intechtivesolutions.com",
  address: "PLOT WSA 1 FB Area Block 1",
  instagram: "https://instagram.com/intechtive.solutions",
  instagramHandle: "@intechtive.solutions",
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
  "Inventory Management",
  "HRMS",
  "POS",
  "Reward App",
  "CRM",
  "E-commerce",
  "Remote Monitoring",
  "Camera Installation",
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
    label: "Remote security monitoring",
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
    name: "HRMS",
    tag: "Human Resource Management",
    blurb: "Attendance, payroll, leave and employee records in one automated workspace.",
    color: "var(--color-primary)",
    image: "/products/hrms.jpg",
    gallery: [
      "/products/hrms.jpg",
      "/products/hrms-2.jpg",
      "/products/hrms-3.jpg",
    ],
  },
  {
    id: "pos",
    name: "POS",
    tag: "Point of Sale",
    blurb: "Fast checkout, live inventory and sales analytics for retail and hospitality.",
    color: "var(--color-accent)",
    image: "/products/hrms.jpg",
    gallery: [
      "/products/hrms.jpg",
      "/products/hrms-2.jpg",
      "/products/hrms-3.jpg",
    ],
  },
  {
    id: "reward",
    name: "Reward App",
    tag: "Loyalty & Engagement",
    blurb: "Points, tiers and campaigns that keep customers coming back.",
    color: "var(--color-primary)",
    image: "/products/hrms.jpg",
    gallery: [
      "/products/hrms.jpg",
      "/products/hrms-2.jpg",
      "/products/hrms-3.jpg",
    ],
  },
  {
    id: "crm",
    name: "CRM",
    tag: "Customer Relationship",
    blurb: "Pipelines, contacts and follow-ups that help your team close more deals.",
    color: "var(--color-accent)",
    image: "/products/hrms.jpg",
    gallery: [
      "/products/hrms.jpg",
      "/products/hrms-2.jpg",
      "/products/hrms-3.jpg",
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce Platform",
    tag: "Online Store",
    blurb: "A ready-to-launch online store with catalogue, cart, payments and order management.",
    color: "var(--color-primary)",
    image: "/products/hrms.jpg",
    gallery: [
      "/products/hrms.jpg",
      "/products/hrms-2.jpg",
      "/products/hrms-3.jpg",
    ],
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
    title: "Remote Security Monitoring",
    text: "24/7 surveillance from a central watchtower with live feeds, motion alerts and incident reporting.",
  },
  {
    title: "Camera Installation",
    text: "Site surveys, CCTV and IP-camera installation, cabling and maintenance, ready to be monitored remotely.",
  },
  {
    title: "Inventory Management",
    text: "Keep stock accurate and under control, from a single store to a full online portal, with real-time levels, supplier and reorder tracking, and reports tied to sales.",
  },
];

export const faqsData: FAQItem[] = [
  {
    q: "What does Intechtive Solutions do?",
    a: "We provide consultancy, custom software development (mobile, web and desktop), custom AI projects, social media marketing, inventory management, ready-made products (HRMS, POS, Reward App, CRM and an E-commerce platform), and remote security monitoring with camera installation.",
  },
  {
    q: "Do you build custom software or only sell ready-made products?",
    a: "Both. Our products can be deployed and tailored to your business, and if you need something unique we design and build it from scratch.",
  },
  {
    q: "How does remote security monitoring work?",
    a: "We install or connect your cameras, then monitor the feeds remotely from a central location, with alerts and incident reporting so issues are handled quickly.",
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
  "Remote Security Monitoring",
  "Camera Installation",
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
