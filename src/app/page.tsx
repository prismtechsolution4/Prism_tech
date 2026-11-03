"use client";

import { useSpotlight } from "@/lib/useSpotlight";
import Preloader from "@/components/Preloader";
import ProgressBar from "@/components/ProgressBar";
import CustomCursor from "@/components/CustomCursor";
import ThreeCanvas from "@/components/ThreeCanvas";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyIntechtive from "@/components/WhyIntechtive";
import Services from "@/components/Services";
import Process from "@/components/Process";
import TechStack from "@/components/TechStack";
import Products from "@/components/Products";
import EngagementModels from "@/components/EngagementModels";
import Infrastructure from "@/components/Infrastructure";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingTalk from "@/components/FloatingTalk";

export default function Home() {
  // Activate interactive spotlight hover tracker on cards
  useSpotlight();

  return (
    <>
      {/* 1. Preloader (0% -> 100% counter) */}
      <Preloader />

      {/* Top page scroll progress bar */}
      <ProgressBar />

      {/* Subtle fine pointer cursor follower */}
      <CustomCursor />

      {/* 3D WebGL Multi-stage Canvas (Hero globe, Services planetary network, Security radar, Contact knot) */}
      <ThreeCanvas />

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* Page Content in exact sequential order */}
      <main className="relative z-10">
        {/* 3. Hero */}
        <Hero />

        {/* 4. Marquee + 5. Why Intechtive */}
        <WhyIntechtive />

        {/* 6. What we do (Interactive node network + accordion) */}
        <Services />

        {/* 7. How we work (6 timeline steps) */}
        <Process />

        {/* 8. Tech stack (3 category cards) */}
        <TechStack />

        {/* 9. Our products (Showcase with carousel) */}
        <Products />

        {/* 10. Engagement models (2 cards) */}
        <EngagementModels />

        {/* 11. Infrastructure services (3 cards) */}
        <Infrastructure />

        {/* 12. FAQ (5 accordion items) */}
        <FAQ />

        {/* 13. Contact form & 14. Footer */}
        <div className="relative">
          <Contact />
          <Footer />
        </div>
      </main>

      {/* Floating CTA "Let's talk" & Lead Popup Modal */}
      <FloatingTalk />
    </>
  );
}
