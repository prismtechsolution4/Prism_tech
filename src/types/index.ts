export interface CompanyInfo {
  name: string;
  tagline: string;
  email: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappNumber: string;
  instagram: string;
  instagramHandle: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  blurb: string;
  points: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  color: string;
  image: string;
  gallery: string[];
  metrics?: { label: string; value: string }[];
  features?: { title: string; desc: string }[];
  badges?: string[];
}

export interface SecurityItem {
  title: string;
  text: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  text: string;
}

export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  title: string;
  description: string;
  items: TechItem[];
}

export interface EngagementModel {
  title: string;
  description: string;
  points: string[];
  footer: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface StatItem {
  target: number | string;
  isCustomDisplay?: boolean;
  displayValue?: string;
  label: string;
}

export interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  service?: string;
  message: string;
  website?: string; // honeypot
  source?: "contact" | "popup";
}
