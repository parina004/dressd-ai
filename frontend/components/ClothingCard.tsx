"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { ClothingItem } from "@/lib/api";
import { imageUrl, displayName } from "@/lib/api";

interface Props {
  item: ClothingItem;
  onDelete: (id: number) => void;
  index: number;
}

const COLOUR_DOT: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f0ece8",
  red: "#c0504d",
  blue: "#5b7fa6",
  green: "#6a9b7e",
  yellow: "#d4a843",
  orange: "#d4834a",
  pink: "#e8a0b0",
  purple: "#9b7db4",
  brown: "#9b7060",
  grey: "#9a9490",
  gray: "#9a9490",
  navy: "#3a4d6b",
  beige: "#d4b896",
};

export default function ClothingCard({ item, onDelete, index }: Props) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const img = imageUrl(item.image_path);
  const dot = COLOUR_DOT[item.colour ?? ""] ?? "var(--blush)";
  const label = displayName(item);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(item.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setConfirmDelete(false); }}
      className="relative group cursor-default"
      style={{ borderRadius: 2 }}
    >
      <motion.div
        animate={{
          y: hovered ? -6 : 0,
          boxShadow: hovered
            ? "0 20px 40px rgba(160,96,107,0.18)"
            : "0 2px 8px rgba(26,22,20,0.06)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "var(--warm-white)",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        {/* image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img ? (
            <motion.img
              src={img}
              alt={label}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div
              className="w-full h-full flex items-end justify-center pb-6"
              style={{ background: "var(--blush-light)" }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 52,
                  color: "var(--blush)",
                  fontWeight: 300,
                  fontStyle: "italic",
                }}
              >
                {item.category === "dress" ? "✦" : item.category === "top" ? "◇" : "◈"}
              </span>
            </div>
          )}

          {/* delete button */}
          <AnimatePresence>
            {hovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                onClick={handleDelete}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                style={{
                  background: confirmDelete ? "var(--rose)" : "var(--warm-white)",
                  color: confirmDelete ? "#fff" : "var(--warm-gray)",
                  border: "1px solid var(--border)",
                  borderRadius: 2,
                  cursor: "pointer",
                  fontWeight: 400,
                }}
              >
                <Trash2 size={11} />
                {confirmDelete ? "confirm" : ""}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-sm truncate pr-2"
              style={{ fontWeight: 400, color: "var(--charcoal)" }}
            >
              {label}
            </span>
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: dot, border: "1px solid var(--border)" }}
            />
          </div>

          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--warm-gray)", letterSpacing: "0.1em" }}
          >
            {item.category}
          </span>

          {/* tags slide up on hover */}
          <AnimatePresence>
            {hovered && item.tags && item.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="flex flex-wrap gap-1 mt-3 overflow-hidden"
              >
                {item.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: "var(--blush-light)",
                      color: "var(--rose)",
                      borderRadius: 2,
                      fontWeight: 400,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
