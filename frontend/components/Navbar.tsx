"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/wardrobe", label: "Wardrobe" },
  { href: "/outfit", label: "Style Me" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ borderBottom: "1px solid var(--border)" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5"
      css-bg="cream"
    >
      <style>{`nav[css-bg="cream"] { background: var(--cream); }`}</style>

      <Link href="/">
        <span
          className="text-2xl tracking-tight select-none"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            color: "var(--charcoal)",
          }}
        >
          dressd.
        </span>
      </Link>

      <div className="flex gap-10">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative group">
              <span
                className="text-sm tracking-widest uppercase transition-colors"
                style={{
                  color: active ? "var(--rose)" : "var(--warm-gray)",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                }}
              >
                {label}
              </span>
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px"
                style={{ background: "var(--blush)" }}
                initial={{ width: active ? "100%" : "0%" }}
                animate={{ width: active ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
