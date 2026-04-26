"use client";

import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "SREE PVM's precision milling transformed our aerospace component supply chain. Their attention to detail and micron-level accuracy is unmatched.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    name: "Briana Patton",
    role: "Operations Manager, AeroTech",
  },
  {
    text: "Implementing their custom tooling solutions was smooth and quick. The team is incredibly knowledgeable and delivered ahead of schedule.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    name: "Bilal Ahmed",
    role: "IT & Production Manager",
  },
  {
    text: "Their quality control on lathe turning is phenomenal. We haven't had a single rejected part since partnering with SREE PVM Engineering.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    name: "Saman Malik",
    role: "Quality Assurance Lead",
  },
  {
    text: "This firm's seamless integration of value engineering drastically reduced our manufacturing costs without sacrificing structural integrity.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    name: "Omar Raza",
    role: "CEO, BuildCore",
  },
  {
    text: "Their rapid prototyping capabilities have transformed our workflow, allowing us to iterate quickly and get our products to market faster.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth execution of our latest industrial design project exceeded expectations. They truly understand complex engineering challenges.",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80",
    name: "Aliza Khan",
    role: "Lead Engineer",
  },
  {
    text: "Our production capacity improved instantly thanks to their highly optimized CNC machining services and expert consulting.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    name: "Farhan Siddiqui",
    role: "Manufacturing Director",
  },
  {
    text: "They delivered a surface finishing solution that was exactly what we needed. The parts look pristine and function perfectly under stress.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    name: "Sana Sheikh",
    role: "Sales Manager, AutoParts",
  },
  {
    text: "Partnering with SREE PVM has significantly boosted our overall operational efficiency and allowed us to scale our production globally.",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80",
    name: "Hassan Ali",
    role: "Supply Chain Director",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div 
                className="p-8 rounded-3xl border border-white/10 bg-[#111111] shadow-2xl max-w-xs w-full transition-colors hover:bg-[#1A1A1A]" 
                key={i}
              >
                <div className="text-gray-300 leading-relaxed text-sm mb-6">&ldquo;{text}&rdquo;</div>
                <div className="flex items-center gap-3">
                  <img
                    width={48}
                    height={48}
                    src={image}
                    alt={name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  <div className="flex flex-col">
                    <div className="font-bold text-white tracking-tight">{name}</div>
                    <div className="text-xs text-blue-400 font-medium tracking-tight mt-0.5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default function TestimonialsSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-[#0A0A0A] pt-0 pb-24 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container z-10 mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[600px] mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="border border-blue-500/30 bg-blue-500/10 text-blue-400 py-1.5 px-6 rounded-full text-xs font-bold tracking-widest uppercase">
              Testimonials
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            Trusted by Industry Leaders.
          </h2>
          <p className="text-gray-400 text-lg">
            See what our engineering partners and clients have to say about the precision and quality we deliver.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[600px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
