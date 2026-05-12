"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ClothingCard from "@/components/ClothingCard";
import AddItemModal from "@/components/AddItemModal";
import { getItems, deleteItem, getTags } from "@/lib/api";
import type { ClothingItem } from "@/lib/api";

const CATEGORY_FILTERS = ["all", "top", "bottom", "dress"];

export default function WardrobePage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    try {
      const [data, tags] = await Promise.all([getItems(), getTags()]);
      setItems(data);
      setAllTags(tags);
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleTagFilter = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = items.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesTags =
      activeTags.length === 0 ||
      activeTags.every((t) => item.tags?.includes(t));
    const matchesSearch =
      !search ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.colour ?? "").toLowerCase().includes(search.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesTags && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <Navbar />

      <div className="pt-28 pb-20 px-10 max-w-7xl mx-auto">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: "var(--blush)", letterSpacing: "0.18em" }}
              >
                ✦ &nbsp; your collection
              </p>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  color: "var(--charcoal)",
                }}
              >
                My Wardrobe
              </h1>
            </div>

            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontStyle: "italic",
                color: "var(--warm-gray)",
              }}
            >
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          {/* search + category filter row */}
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <div
              className="flex items-center gap-2 px-4 py-2 flex-1 max-w-xs"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <Search size={13} color="var(--warm-gray)" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by colour, tag…"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "var(--charcoal)",
                  fontWeight: 300,
                  width: "100%",
                }}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setCategoryFilter(f)}
                  className="px-4 py-2 text-xs tracking-wide capitalize transition-all"
                  style={{
                    background: categoryFilter === f ? "var(--charcoal)" : "transparent",
                    color: categoryFilter === f ? "var(--warm-white)" : "var(--warm-gray)",
                    border: "1px solid",
                    borderColor: categoryFilter === f ? "var(--charcoal)" : "var(--border)",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontWeight: 400,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* tag filter chips */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs"
                style={{ color: "var(--warm-gray)", fontWeight: 300, whiteSpace: "nowrap" }}
              >
                filter by tag
              </span>
              {allTags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    whileTap={{ scale: 0.94 }}
                    className="px-3 py-1 text-xs transition-all"
                    style={{
                      background: active ? "var(--blush-light)" : "transparent",
                      color: active ? "var(--rose)" : "var(--warm-gray)",
                      border: "1px solid",
                      borderColor: active ? "var(--blush)" : "var(--border)",
                      borderRadius: 2,
                      cursor: "pointer",
                      fontWeight: 400,
                    }}
                  >
                    {tag}
                  </motion.button>
                );
              })}

              {/* clear tag filters */}
              <AnimatePresence>
                {activeTags.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    onClick={() => setActiveTags([])}
                    className="text-xs"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--blush)",
                      cursor: "pointer",
                      fontStyle: "italic",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 13,
                    }}
                  >
                    clear ×
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* divider */}
        <div style={{ height: 1, background: "var(--border)", marginBottom: 32 }} />

        {/* grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 20,
                height: 20,
                border: "1.5px solid var(--blush)",
                borderTopColor: "transparent",
                borderRadius: "50%",
              }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 52,
                color: "var(--blush)",
                fontStyle: "italic",
              }}
            >
              ✦
            </span>
            <p style={{ color: "var(--warm-gray)", fontSize: 14, fontWeight: 300 }}>
              {search || categoryFilter !== "all" || activeTags.length > 0
                ? "Nothing matches that."
                : "Your wardrobe is empty."}
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15,
                fontStyle: "italic",
                color: "var(--blush)",
                cursor: "pointer",
              }}
              onClick={() => setModalOpen(true)}
            >
              Add your first piece →
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
            >
              {filtered.map((item, i) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  index={i}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* floating add button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase"
        style={{
          background: "var(--charcoal)",
          color: "var(--warm-white)",
          border: "none",
          borderRadius: 2,
          cursor: "pointer",
          letterSpacing: "0.14em",
          fontWeight: 400,
          boxShadow: "0 8px 24px rgba(26,22,20,0.18)",
          zIndex: 30,
        }}
      >
        <Plus size={13} />
        Add piece
      </motion.button>

      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={load}
      />
    </div>
  );
}
