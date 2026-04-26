"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Pen,
  PaintBucket,
  Home,
  Ruler,
  PenTool,
  Building2,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView, useSpring, type Variants } from "motion/react"

export default function AboutUsSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const services = [
    {
      icon: <Pen className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-blue-500" />,
      title: "CNC Machining",
      description: "High-precision CNC components tailored to your specific technical requirements, ensuring micron-level accuracy.",
      position: "left",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-blue-500" />,
      title: "Industrial Design",
      description: "Innovative engineering designs that prioritize structural integrity, efficiency, and long-term durability.",
      position: "left",
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-blue-500" />,
      title: "Value Management",
      description: "Optimizing your manufacturing processes to reduce costs while maintaining the highest standards of quality.",
      position: "left",
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-blue-500" />,
      title: "Project Planning",
      description: "Strategic engineering roadmaps that ensure your projects are delivered on time and to your exact specifications.",
      position: "right",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-blue-500" />,
      title: "Rapid Prototyping",
      description: "Accelerate your development cycle with our precision prototyping services for quick iteration and validation.",
      position: "right",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-blue-500" />,
      title: "Quality Execution",
      description: "Watching your technical visions come to life through our flawless execution and rigorous quality control.",
      position: "right",
    },
  ]

  const stats = [
    { icon: <Award />, value: 150, label: "Projects Completed", suffix: "+" },
    { icon: <Users />, value: 1200, label: "Happy Clients", suffix: "+" },
    { icon: <Calendar />, value: 12, label: "Years Experience", suffix: "" },
    { icon: <TrendingUp />, value: 98, label: "Satisfaction Rate", suffix: "%" },
  ]

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full py-24 px-4 bg-gradient-to-b from-white to-[#F8F8F2] text-[#0A0A0A] overflow-hidden relative"
    >
      <motion.div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" style={{ y: y1, rotate: rotate1 }} />
      <motion.div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" style={{ y: y2, rotate: rotate2 }} />
      
      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <motion.span className="text-blue-600 font-bold tracking-widest mb-2 flex items-center gap-2 text-xs" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Zap className="w-4 h-4" /> DISCOVER OUR STORY
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center tracking-tighter">About Us</h2>
          <motion.div className="w-24 h-1.5 bg-blue-600 rounded-full" initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 1, delay: 0.5 }} />
        </motion.div>

        <motion.p className="text-center max-w-2xl mx-auto mb-16 text-gray-600 leading-relaxed" variants={itemVariants}>
          SREE PVM ENGINEERING is a premier technical firm dedicated to precision machining and value-driven engineering. We combine state-of-the-art technology with deep industry expertise.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="space-y-16">
            {services.filter(s => s.position === "left").map((s, i) => (
              <ServiceItem key={i} {...s} variants={itemVariants} delay={i * 0.2} direction="left" />
            ))}
          </div>
          <div className="flex justify-center items-center mb-8 md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white" whileHover={{ scale: 1.03 }}>
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="About" className="w-full h-[450px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end justify-center p-6">
                  <motion.button className="bg-white text-blue-600 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    View Projects <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
          <div className="space-y-16">
            {services.filter(s => s.position === "right").map((s, i) => (
              <ServiceItem key={i} {...s} variants={itemVariants} delay={i * 0.2} direction="right" />
            ))}
          </div>
        </div>

        <motion.div ref={statsRef} className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" initial="hidden" animate={isStatsInView ? "visible" : "hidden"} variants={containerVariants}>
          {stats.map((stat, i) => (
            <StatCounter key={i} {...stat} delay={i * 0.1} />
          ))}
        </motion.div>

        <motion.div className="mt-20 bg-blue-600 text-white p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl" initial={{ opacity: 0, y: 30 }} animate={isStatsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5 }}>
          <div>
            <h3 className="text-3xl font-bold mb-2">Ready to optimize?</h3>
            <p className="text-blue-100">Let's build the future together.</p>
          </div>
          <motion.button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction }: any) {
  return (
    <motion.div className="flex flex-col group" variants={variants} transition={{ delay }} whileHover={{ y: -5 }}>
      <div className="flex items-center gap-3 mb-3">
        <motion.div className="text-blue-600 bg-blue-600/10 p-3 rounded-xl relative" whileHover={{ rotate: 5 }}>
          {icon} {secondaryIcon}
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed pl-12">{description}</p>
    </motion.div>
  )
}

function StatCounter({ icon, value, label, suffix, delay }: any) {
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: false })
  const [hasAnimated, setHasAnimated] = useState(false)
  const springValue = useSpring(0, { stiffness: 50, damping: 10 })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    } else if (!isInView && hasAnimated) {
      springValue.set(0)
      setHasAnimated(false)
    }
  }, [isInView, value, springValue, hasAnimated])

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  return (
    <motion.div className="bg-white border border-gray-100 p-8 rounded-3xl flex flex-col items-center group transition-all" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } } }} whileHover={{ y: -10 }}>
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div ref={countRef} className="text-4xl font-bold text-gray-900 flex items-center tracking-tighter">
        <motion.span>{displayValue}</motion.span><span>{suffix}</span>
      </div>
      <p className="text-gray-500 font-medium text-sm mt-2">{label}</p>
      <div className="w-8 h-1 bg-blue-600 mt-4 rounded-full group-hover:w-16 transition-all" />
    </motion.div>
  )
}
