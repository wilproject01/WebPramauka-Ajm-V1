import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trees as Tree, Menu, X, ShieldCheck, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const location = useLocation();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "content", "brand"), (snapshot) => {
      if (snapshot.exists()) {
        setLogoUrl(snapshot.data().logoUrl || "");
      }
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Struktur", path: "/#struktur" },
    { name: "Dokumentasi", path: "/dokumentasi" },
    { name: "Pendaftaran", path: "/pendaftaran" },
  ];

  const handleScrollToStruktur = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      const el = document.getElementById("struktur");
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-[1.5rem] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <div className="bg-blue-600 p-1 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30 overflow-hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Tree className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">
            PRAMUKA <span className="text-blue-400">AJM</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isDokumentasi = link.path === "/dokumentasi";
            const isActive = location.pathname === link.path;

            if (link.path.startsWith("/#")) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={handleScrollToStruktur}
                  className="text-sm font-medium text-white/70 hover:text-blue-400 transition-colors uppercase tracking-wider"
                >
                  {link.name}
                </a>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all uppercase tracking-wider relative py-1 ${
                  isActive
                    ? "text-blue-400 font-bold"
                    : isDokumentasi
                    ? "text-white/90 hover:text-blue-300 flex items-center gap-1.5"
                    : "text-white/70 hover:text-blue-400"
                }`}
              >
                {isDokumentasi && <Camera className="w-3.5 h-3.5 text-blue-400" />}
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl border-white/10 text-white hover:bg-white/10 bg-transparent">
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-1" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="md:hidden absolute top-16 left-0 right-0 glass bg-zinc-950/95 border border-white/15 rounded-[2rem] shadow-2xl p-6 flex flex-col gap-3 mx-2"
          >
            {navLinks.map((link) => {
              const isDokumentasi = link.path === "/dokumentasi";
              const isActive = location.pathname === link.path;

              if (link.path.startsWith("/#")) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleScrollToStruktur(e);
                    }}
                    className="text-base font-medium p-3 text-white/80 hover:text-white border-b border-white/5"
                  >
                    {link.name}
                  </a>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium p-3 border-b border-white/5 flex items-center justify-between rounded-xl transition-colors ${
                    isActive ? "text-blue-400 font-bold bg-white/5" : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isDokumentasi && <Camera className="w-4 h-4 text-blue-400" />}
                    {link.name}
                  </span>
                  {isDokumentasi && (
                    <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-bold border border-blue-500/30">
                      Buka Galeri
                    </span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
