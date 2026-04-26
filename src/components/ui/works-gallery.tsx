"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface Project {
    title: string;
    category: string;
    image: string;
    description: string;
}

const PROJECTS: Project[] = [
    {
        title: "Precision Aerospace Parts",
        category: "CNC Machining",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
        description: "High-tolerance aerospace components manufactured with 5-axis CNC milling machines for maximum precision and structural integrity."
    },
    {
        title: "Automotive Engine Blocks",
        category: "Industrial Engineering",
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
        description: "Mass production of high-performance aluminum engine blocks using automated CNC lathes and advanced quality control systems."
    },
    {
        title: "Medical Implant Prototypes",
        category: "Precision Milling",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
        description: "Specialized titanium medical implants designed and manufactured with micron-level accuracy for biocompatibility and durability."
    },
    {
        title: "Industrial Gear Assemblies",
        category: "Heavy Industry",
        image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1200",
        description: "Large-scale gear manufacturing for industrial machinery, focusing on load-bearing capacity and long-term operational efficiency."
    }
];

export default function WorksGallery({ id }: { id?: string }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

    return (
        <section id={id} ref={targetRef} className="relative h-[250vh] bg-black">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute inset-x-0 top-12 z-10 flex flex-col items-center justify-center text-center">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-blue-500 uppercase mb-4 font-sans">Next Milestone</h2>
                    <h3 className="text-5xl md:text-8xl font-bold text-white tracking-tighter font-sans">
                        FUTURE PLANS.
                    </h3>
                </div>
                <motion.div style={{ x }} className="flex gap-24 px-10 pt-72">
                    {PROJECTS.map((project, index) => (
                        <div
                            key={index}
                            className="group relative h-[450px] w-[350px] md:h-[600px] md:w-[800px] flex-shrink-0 overflow-hidden rounded-3xl bg-neutral-900 border border-white/10"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <div className="absolute bottom-10 left-10 right-10">
                                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2 block">
                                    {project.category}
                                </span>
                                <h4 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                    {project.title}
                                </h4>
                                <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {project.description}
                                </p>
                            </div>

                            <div className="absolute top-10 right-10">
                                <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 7h10v10" />
                                        <path d="M7 17 17 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
