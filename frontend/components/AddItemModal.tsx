"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { createItem, uploadImageForPath, getTags } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const CATEGORIES = ["top", "bottom", "dress"];
const COLOURS = [
  "black", "white", "red", "blue", "green", "yellow",
  "orange", "pink", "purple", "brown", "grey", "beige",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--border)",
  padding: "8px 0",
  fontSize: 14,
  color: "var(--charcoal)",
  outline: "none",
  fontWeight: 300,
  transition: "border-color 0.2s",
};

export default function AddItemModal({ open, onClose, onAdded }: Props) {
  const [category, setCategory] = useState("top");
  const [colour, setColour] = useState("black");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch existing tags from the wardrobe whenever modal opens
  useEffect(() => {
    if (open) {
      getTags().then(setExistingTags);
    }
  }, [open]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addNewTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (!file) { setError("A photo is required"); return; }
    setError("");
    setLoading(true);
    try {
      const image_path = await uploadImageForPath(file);
      await createItem({ category, colour, tags, image_path });
      setCategory("top"); setColour("black");
      setTags([]); setTagInput(""); setFile(null);
      onAdded();
      onClose();
    } catch {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(26,22,20,0.35)", backdropFilter: "blur(4px)" }}
          />

          {/* panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-8 pb-10"
            style={{
              background: "var(--cream)",
              borderTop: "1px solid var(--border)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-8">
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 500,
                  color: "var(--charcoal)",
                }}
              >
                Add to wardrobe
              </h2>
              <button onClick={onClose} style={{ color: "var(--warm-gray)", cursor: "pointer", background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-xl">
              {/* category + colour */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--warm-gray)" }}>
                    Category
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className="px-3 py-1.5 text-xs tracking-wide capitalize transition-all"
                        style={{
                          background: category === c ? "var(--charcoal)" : "transparent",
                          color: category === c ? "var(--warm-white)" : "var(--warm-gray)",
                          border: "1px solid",
                          borderColor: category === c ? "var(--charcoal)" : "var(--border)",
                          borderRadius: 2,
                          cursor: "pointer",
                          fontWeight: 400,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--warm-gray)" }}>
                    Colour
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOURS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColour(c)}
                        className="px-3 py-1.5 text-xs capitalize transition-all"
                        style={{
                          background: colour === c ? "var(--blush-light)" : "transparent",
                          color: colour === c ? "var(--rose)" : "var(--warm-gray)",
                          border: "1px solid",
                          borderColor: colour === c ? "var(--blush)" : "var(--border)",
                          borderRadius: 2,
                          cursor: "pointer",
                          fontWeight: 400,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* tags */}
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <label className="text-xs tracking-widest uppercase" style={{ color: "var(--warm-gray)" }}>
                    Style tags
                  </label>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      color: "var(--blush)",
                      fontSize: 13,
                    }}
                  >
                    select all that apply — the more, the better
                  </span>
                </div>

                {/* existing tags as toggle chips */}
                {existingTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {existingTags.map((tag) => {
                      const selected = tags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 text-xs transition-all"
                          style={{
                            background: selected ? "var(--charcoal)" : "transparent",
                            color: selected ? "var(--warm-white)" : "var(--warm-gray)",
                            border: "1px solid",
                            borderColor: selected ? "var(--charcoal)" : "var(--border)",
                            borderRadius: 2,
                            cursor: "pointer",
                            fontWeight: 400,
                          }}
                        >
                          {tag}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* add a new tag */}
                <div
                  className="flex items-center gap-2 mt-2"
                  style={{ borderTop: existingTags.length > 0 ? "1px solid var(--border)" : "none", paddingTop: existingTags.length > 0 ? 12 : 0 }}
                >
                  <span className="text-xs" style={{ color: "var(--warm-gray)", whiteSpace: "nowrap", fontWeight: 300 }}>
                    + new tag
                  </span>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNewTag()}
                    placeholder="type and press Enter"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                  <button
                    onClick={addNewTag}
                    style={{ background: "none", border: "none", color: "var(--blush)", cursor: "pointer", paddingBottom: 2 }}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* show any newly added tags (not in existing list) as removable chips */}
                {tags.filter((t) => !existingTags.includes(t)).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.filter((t) => !existingTags.includes(t)).map((t) => (
                      <span
                        key={t}
                        onClick={() => toggleTag(t)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs cursor-pointer"
                        style={{ background: "var(--blush-light)", color: "var(--rose)", borderRadius: 2 }}
                      >
                        {t}
                        <X size={9} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* image — required */}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--warm-gray)" }}>
                  Photo <span style={{ color: "var(--rose)" }}>*</span>
                </label>
                <label
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ borderBottom: "1px solid var(--border)", padding: "8px 0" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <span className="text-sm" style={{ color: file ? "var(--charcoal)" : "var(--warm-gray)", fontWeight: 300 }}>
                    {file ? file.name : "Choose a photo…"}
                  </span>
                </label>
              </div>

              {error && (
                <p className="text-xs" style={{ color: "var(--rose)" }}>{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 py-3 text-sm tracking-widest uppercase transition-all"
                style={{
                  background: loading ? "var(--blush)" : "var(--charcoal)",
                  color: "var(--warm-white)",
                  border: "none",
                  borderRadius: 2,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.14em",
                  fontWeight: 400,
                }}
              >
                {loading ? "Adding…" : "Add item"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
