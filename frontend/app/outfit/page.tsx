"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getOutfit, imageUrl } from "@/lib/api";
import type { ClothingItem } from "@/lib/api";

const PROMPTS = [
  "a dinner date, nothing too casual…",
  "board meeting energy, but make it chic",
  "sunday brunch with friends",
  "gallery opening, monochrome only",
  "beach day, flowy and easy",
];

export default function OutfitPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ClothingItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const rotatePlaceholder = () => {
    setPromptIndex((i) => (i + 1) % PROMPTS.length);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSubmitted(true);
    try {
      const data = await getOutfit(query.trim());
      setResult(data);
    } catch {
      setError("Couldn't reach the backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuery("");
    setResult(null);
    setError("");
    setSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16">

        {/* pre-submit: query interface */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="query"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs tracking-widest uppercase mb-8"
                style={{ color: "var(--blush)", letterSpacing: "0.2em" }}
              >
                ✦ &nbsp; style me &nbsp; ✦
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(28px, 5vw, 48px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "var(--charcoal)",
                  marginBottom: 48,
                }}
              >
                What are you{" "}
                <em style={{ color: "var(--blush)", fontStyle: "italic" }}>dressing</em>{" "}
                for today?
              </motion.h1>

              {/* input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="relative"
                style={{ borderBottom: "1.5px solid var(--charcoal)", paddingBottom: 12, marginBottom: 20 }}
              >
                <input
                  ref={inputRef}
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder={PROMPTS[promptIndex]}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "clamp(16px, 2.5vw, 22px)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "var(--charcoal)",
                    paddingRight: 40,
                  }}
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 12,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--blush)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowRight size={20} />
                </button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={rotatePlaceholder}
                className="text-xs tracking-wide"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--warm-gray)",
                  cursor: "pointer",
                  fontWeight: 300,
                }}
              >
                try another prompt ↻
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl"
            >
              {/* query echo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--blush)", letterSpacing: "0.18em" }}>
                  ✦ &nbsp; styled for
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(20px, 3.5vw, 32px)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "var(--charcoal)",
                  }}
                >
                  "{query}"
                </p>
              </motion.div>

              {/* loading */}
              {loading && (
                <div className="flex flex-col items-center gap-4 py-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 24,
                      height: 24,
                      border: "1.5px solid var(--blush)",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 16,
                      fontStyle: "italic",
                      color: "var(--warm-gray)",
                    }}
                  >
                    curating your look…
                  </p>
                </div>
              )}

              {/* error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-sm"
                  style={{ color: "var(--rose)" }}
                >
                  {error}
                </motion.p>
              )}

              {/* results */}
              {result && !loading && (
                <div>
                  {result.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-16"
                    >
                      <span style={{ fontSize: 40, color: "var(--blush)" }}>✦</span>
                      <p className="mt-4 text-sm" style={{ color: "var(--warm-gray)", fontWeight: 300 }}>
                        Nothing matched in your wardrobe.
                      </p>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 14,
                          fontStyle: "italic",
                          color: "var(--blush)",
                          marginTop: 8,
                        }}
                      >
                        Try a broader description or add more pieces.
                      </p>
                    </motion.div>
                  ) : (
                    <div
                      className="flex gap-8 justify-center flex-wrap"
                      style={{ alignItems: "flex-start" }}
                    >
                      {result.map((item, i) => {
                        const fromLeft = i === 0;
                        const img = imageUrl(item.image_path);
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.1 + i * 0.1,
                              duration: 0.7,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ width: "min(280px, 42vw)" }}
                          >
                            {/* image */}
                            <div
                              style={{
                                aspectRatio: "3/4",
                                borderRadius: 2,
                                overflow: "hidden",
                                marginBottom: 16,
                                border: "1px solid var(--border)",
                              }}
                            >
                              {img ? (
                                <img
                                  src={img}
                                  alt={item.category}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    background: "var(--blush-light)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "'Cormorant Garamond', serif",
                                      fontSize: 48,
                                      color: "var(--blush)",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {item.category === "dress" ? "✦" : item.category === "top" ? "◇" : "◈"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* details */}
                            <p
                              className="text-sm mb-1"
                              style={{ fontWeight: 400, color: "var(--charcoal)" }}
                            >
                              {item.colour
                                ? item.colour.charAt(0).toUpperCase() + item.colour.slice(1) + " " + item.category
                                : item.category}
                            </p>
                            <p
                              className="text-xs tracking-widest uppercase mb-3"
                              style={{ color: "var(--warm-gray)", letterSpacing: "0.1em" }}
                            >
                              {item.category} &nbsp;·&nbsp; {item.colour}
                            </p>

                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {item.tags.slice(0, 4).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5"
                                    style={{
                                      background: "var(--blush-light)",
                                      color: "var(--rose)",
                                      borderRadius: 2,
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* divider */}
                  <div style={{ height: 1, background: "var(--border)", margin: "40px 0 32px" }} />

                  {/* try again */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={reset}
                      className="flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase"
                      style={{
                        background: "transparent",
                        color: "var(--charcoal)",
                        border: "1px solid var(--border)",
                        borderRadius: 2,
                        cursor: "pointer",
                        letterSpacing: "0.14em",
                        fontWeight: 400,
                      }}
                    >
                      <RefreshCw size={11} />
                      Try another look
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
