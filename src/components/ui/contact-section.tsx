"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function ContactSection({ id }: { id?: string }) {
    const [showToast, setShowToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("General Inquiry");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // We use Web3Forms to send emails directly from the frontend without a backend.
            const accessKey = "130b8766-8e4f-4b04-9f05-8c02905f25e9"; 
            
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    subject: `SREE PVM Alert: New message regarding ${subject}`,
                    from_name: "SREE PVM Website",
                    name: name,
                    email: email,
                    message: `Someone has viewed our website and sent a message!\n\nFull Name: ${name}\nEmail Address: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                // Show success notification
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
                
                // Clear the form
                setName("");
                setEmail("");
                setMessage("");
                setSubject("General Inquiry");
            } else {
                alert("Please add your Web3Forms Access Key in the code to send emails!");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("An error occurred while sending the message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id={id} className="relative min-h-screen bg-[#0A0A0A] py-24 px-6 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                {/* Left Side: Text */}
                <div className="flex flex-col justify-center">
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold tracking-[0.3em] text-blue-500 uppercase mb-6"
                    >
                        Contact Us
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-[0.9]"
                    >
                        Let's Engineer <br /> Your Future.
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed"
                    >
                        Ready to start your next precision engineering project? Our team is standing by to help you with value management, CNC machining, and state-of-the-art industrial solutions.
                    </motion.p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-white">
                            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Email Us</p>
                                <p className="text-lg font-medium">dkvisruthsarwin@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Call Us</p>
                                <p className="text-lg font-medium">9842018147</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                            <select 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            >
                                <option className="bg-[#1A1A1A]">General Inquiry</option>
                                <option className="bg-[#1A1A1A]">CNC Machining Project</option>
                                <option className="bg-[#1A1A1A]">Value Management Consulting</option>
                                <option className="bg-[#1A1A1A]">Partnership Opportunity</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                            <textarea 
                                rows={5}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How can we help you?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 resize-none"
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            {isSubmitting ? "Sending Message..." : "Send Message"}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Success Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] bg-[#111111] border border-white/10 shadow-2xl shadow-blue-900/20 rounded-2xl p-6 max-w-sm md:max-w-md flex items-start gap-4"
                    >
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex flex-shrink-0 items-center justify-center text-blue-400 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-1.5 text-lg tracking-tight">Message Sent Successfully!</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Someone has sent a message regarding <span className="text-blue-400 font-semibold">"{subject}"</span>. Our team will review it and get back to you shortly.
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowToast(false)} 
                            className="text-gray-500 hover:text-white transition-colors p-1"
                            aria-label="Close notification"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
