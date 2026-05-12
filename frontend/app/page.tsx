"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const TAGLINES = [
  "tell me what you're feeling.",
  "where are you headed tonight?",
  "dress the mood, not the occasion.",
  "your wardrobe, finally listening.",
];

export default function LandingPage() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const titleLetters = "dressd.".split("");

  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "var(--cream)" }}
    >
      {/* decorative blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,167,0.18) 0%, transparent 70%)",
          top: -100,
          right: -80,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,167,0.12) 0%, transparent 70%)",
          bottom: 60,
          left: -60,
        }}
      />

      {/* nav */}
      <nav className="flex items-center justify-between px-10 py-7">
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--charcoal)",
          }}
        >
          dressd.
        </span>
        <div className="flex gap-8">
          {[{ href: "/wardrobe", label: "Wardrobe" }, { href: "/outfit", label: "Style Me" }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-widest uppercase transition-colors hover:opacity-60"
              style={{ color: "var(--warm-gray)", letterSpacing: "0.12em", fontWeight: 400 }}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">

        {/* small label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <span style={{ width: 28, height: 1, background: "var(--blush)", display: "block" }} />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--warm-gray)", letterSpacing: "0.2em" }}
          >
            AI wardrobe stylist
          </span>
          <span style={{ width: 28, height: 1, background: "var(--blush)", display: "block" }} />
        </motion.div>

        {/* giant title */}
        <div className="flex overflow-hidden mb-6">
          {titleLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.4 + i * 0.06,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(72px, 16vw, 160px)",
                fontWeight: 600,
                lineHeight: 1,
                color: letter === "." ? "var(--blush)" : "var(--charcoal)",
                letterSpacing: "-0.02em",
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* animated tagline */}
        <div className="h-8 flex items-center justify-center mb-14 overflow-hidden">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--warm-gray)",
            }}
          >
            {TAGLINES[taglineIndex]}
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Link href="/wardrobe">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase"
              style={{
                background: "var(--charcoal)",
                color: "var(--warm-white)",
                borderRadius: 2,
                letterSpacing: "0.14em",
                fontWeight: 400,
                cursor: "pointer",
                display: "inline-flex",
              }}
            >
              My wardrobe
              <span style={{ color: "var(--blush)" }}>→</span>
            </motion.span>
          </Link>

          <Link href="/outfit">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase"
              style={{
                background: "transparent",
                color: "var(--charcoal)",
                border: "1px solid var(--border)",
                borderRadius: 2,
                letterSpacing: "0.14em",
                fontWeight: 400,
                cursor: "pointer",
                display: "inline-flex",
              }}
            >
              Style me
              <span style={{ color: "var(--blush)" }}>✦</span>
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="flex justify-center pb-8"
        style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}
      >
        <p
          className="text-xs tracking-widest"
          style={{ color: "var(--blush)", letterSpacing: "0.2em" }}
        >
          ✦ &nbsp; your clothes, finally making sense &nbsp; ✦
        </p>
      </motion.div>
    </main>
  );
}
