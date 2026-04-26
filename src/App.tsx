import { useState } from "react";
import { Component as SignIn } from "@/components/ui/sign-in-flo";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import AboutUsSection from "@/components/ui/about-us-section";
import ServicesCarousel from "@/components/ui/services-card";
import WorksGallery from "@/components/ui/works-gallery";
import TestimonialsSection from "@/components/ui/testimonials";
import ImageSphereSection from "@/components/ui/img-sphere";
import ContactSection from "@/components/ui/contact-section";
import Navbar from "@/components/ui/navbar";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <SignIn onSuccess={() => setIsAuthenticated(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <div className="relative">
              <Navbar logoText="SREE PVM ENGINEERING" />
              <div id="home">
                <CinematicHero 
                  brandName="SREE PVM ENGINEERING"
                  tagline1="Precision Engineering,"
                  tagline2="not just results."
                  cardHeading="Value Management, redefined."
                  cardDescription={<><span className="text-white font-semibold">SREE PVM Engineering</span> provides high-end engineering services with a focus on efficiency, precision, and state-of-the-art technology.</>}
                  metricValue={100}
                  metricLabel="Projects Completed"
                  ctaHeading="Start your journey with SREE PVM."
                  ctaDescription="Join leading industries worldwide and take control of your engineering projects today with SREE PVM ENGINEERING."
                />
              </div>
              <div id="landing-banner">
                <ResponsiveHeroBanner />
              </div>
              <div id="about">
                <AboutUsSection id="about-section" />
              </div>
              <ServicesCarousel id="services" />
              <WorksGallery id="works" />
              <TestimonialsSection id="testimonials" />
              <ImageSphereSection id="biog" />
              <ContactSection id="contact" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
