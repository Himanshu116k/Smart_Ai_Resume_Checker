import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [active, setActive] = useState(null);

  const modules = [
    {
      title: "Resume Engine",
      desc: "AI rewrites and restructures your resume into recruiter-ready format.",
      details:
        "Deep parsing, keyword injection, ATS optimization, and formatting reconstruction with real-time scoring.",
    },
    {
      title: "Job Intelligence",
      desc: "Understands job roles deeply and aligns your profile precisely.",
      details:
        "Analyzes job descriptions, extracts intent, maps skill gaps, and suggests exact improvements.",
    },
    {
      title: "Interview AI",
      desc: "Generates real interview scenarios based on your profile.",
      details:
        "Creates adaptive questions, behavioral simulations, and role-specific technical challenges.",
    },
    {
      title: "Optimization Loop",
      desc: "Continuously improves your resume until peak performance.",
      details:
        "Iterative feedback loop with scoring, refinement cycles, and performance tracking.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-hidden font-sans relative">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,0,120,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,120,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* HERO */}
      <section className="relative z-10 px-10 pt-24 pb-10">
        <motion.p
          className="text-pink-500 tracking-[0.4em] text-xs mb-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ● AI-POWERED CAREER INTELLIGENCE
        </motion.p>

        <h1 className="text-7xl md:text-8xl font-extrabold leading-[0.9] bg-gradient-to-r from-white via-pink-400 to-pink-600 bg-clip-text text-transparent">
          INTERVIEW
          <br /> ANALYZER
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl text-lg">
          A futuristic AI system that reconstructs resumes, matches jobs, and simulates interviews.
        </p>
      </section>

      {/* 🔥 MIDDLE INTERACTIVE ANIMATION SECTION (FIXED) */}
      <section className="relative z-10 mt-10 px-10">
        <div className="relative h-[350px] border border-pink-500/20 rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl">

          {/* Moving Resume Sheet */}
          <motion.div
            className="absolute top-10 left-10 w-52 h-64 bg-white/10 border border-pink-400/30 rounded-xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Scanning Line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px] bg-pink-500"
            animate={{ y: [0, 320] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Floating Text Blocks */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute right-10 w-40 h-6 bg-pink-500/20 rounded"
              style={{ top: 40 + i * 40 }}
              animate={{ x: [0, -20, 0] }}
              transition={{ duration: 2 + i, repeat: Infinity }}
            />
          ))}

          {/* AI Processing Glow */}
          <motion.div
            className="absolute inset-0 bg-pink-500/5"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </section>

      {/* FOLDER SYSTEM */}
      <section className="relative z-10 mt-20 px-10">
        <h2 className="text-3xl font-bold text-pink-400 mb-10">SYSTEM MODULES</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {modules.map((item, i) => (
            <motion.div
              key={i}
              onClick={() => setActive(item)}
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-pink-500/10 rounded-2xl translate-x-2 translate-y-2 blur-sm" />
              <div className="absolute inset-0 bg-pink-500/20 rounded-2xl translate-x-1 translate-y-1" />

              <div className="relative bg-black border border-pink-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,120,0.25)] group-hover:shadow-[0_0_60px_rgba(255,0,120,0.4)] transition">
                <div className="absolute -top-3 left-6 w-24 h-6 bg-pink-500/30 rounded-t-md border border-pink-500/40" />

                <h3 className="text-xl font-bold text-pink-400 mt-2">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-3 text-sm">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE PANEL */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0a0a0a] border border-pink-500/40 rounded-2xl p-8 w-[500px] relative shadow-[0_0_60px_rgba(255,0,120,0.4)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-2xl text-pink-400 font-bold mb-4">
                {active.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed">
                {active.details}
              </p>

              <motion.div
                className="mt-6 h-[3px] bg-pink-500"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-10 mt-32 px-10 py-14 border-t border-pink-500/20">
        <div className="text-center text-gray-500 text-xs">
          © 2026 Interview Analyzer — Cyber Intelligence System
        </div>
      </footer>
    </div>
  );
}
