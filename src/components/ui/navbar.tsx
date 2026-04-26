"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface NavbarProps {
    logoText?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
}

const Navbar: React.FC<NavbarProps> = ({
    logoText = "SREE PVM ENGINEERING",
    navLinks = [
        { label: "HOME", href: "#home", isActive: true },
        { label: "ABOUT", href: "#about-section" },
        { label: "FUTURE PLANS", href: "#works" },
        { label: "SERVICES", href: "#services" },
        { label: "TESTIMONIAL", href: "#testimonials" },
        { label: "BIOG", href: "#biog" }, // Now points to ImageSphereSection
        { label: "CONTACT", href: "#contact" }
    ],
    ctaButtonText = "Dashboard",
    ctaButtonHref = "#"
}) => {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header 
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <a href="#home" className="text-2xl font-bold text-white tracking-tighter">
                        {logoText}
                    </a>

                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors rounded-full",
                                    link.isActive 
                                        ? "text-white bg-white/10" 
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href={ctaButtonHref}
                        className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
                    >
                        {ctaButtonText}
                    </a>
                    
                    {/* Mobile Menu Trigger Placeholder */}
                    <button className="md:hidden p-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
