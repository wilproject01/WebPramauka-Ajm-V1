import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Compass, 
  Sparkles,
  Camera,
  Calendar,
  MapPin,
  ArrowUpRight,
  Layers,
  Images
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";

const DEFAULT_ACTIVITIES = [
  {
    url: "https://images.unsplash.com/photo-1526620536413-5de78833917d?q=80&w=1000&auto=format&fit=crop",
    title: "Latihan Gabungan Pramuka",
    date: "24 April 2026",
    location: "Lapangan SMKN 2 Garut",
    desc: "Latihan teknik pionering, semaphore, dan ketangkasan bersama regu."
  },
  {
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop",
    title: "Perkemahan PERSAMI",
    date: "08 Mei 2026",
    location: "Buper Mandalawangi",
    desc: "Membangun kemandirian, kedisiplinan, dan persaudaraan di alam terbuka."
  },
  {
    url: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=1000&auto=format&fit=crop",
    title: "Penjelajahan Alam Bebas",
    date: "12 Maret 2026",
    location: "Kaki Gn. Cikuray",
    desc: "Uji navigasi kompas dan kebersamaan rimba penjelajahan alam Garut."
  },
  {
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
    title: "Pelantikan Penegak Bantara",
    date: "19 Feb 2026",
    location: "Aula SMKN 2 Garut",
    desc: "Prosesi sakral pengukuhan penegak baru penerus tunas kelapa."
  }
];

export function Hero() {
  const [hero, setHero] = useState({
    title: "GERAKAN PRAMUKA GUGUS DEPAN 02.095 - 02.096",
    subtitle: "Ambalan Ir. H. Juanda - Laksamana Malahayati || Wadahnya para anak kreatif untuk mengasah keterampilan, kedisiplinan, dan jiwa kepemimpinan di era modern.",
    cta: "JOIN SEKARANG"
  });
  const [stats, setStats] = useState([
    { label: "Dewan Ambalan", value: "0" },
    { label: "Calon Dewan", value: "0" },
    { label: "Calon Bantara", value: "0" }
  ]);
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);

  useEffect(() => {
    // Hero Listener
    const unsubHero = onSnapshot(doc(db, "content", "hero"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setHero(prev => ({
          title: data.title || prev.title,
          subtitle: data.subtitle || prev.subtitle,
          cta: data.cta || prev.cta
        }));
      }
    });

    // Dynamic Stats Listener (synchronized with structure_members)
    const unsubStats = onSnapshot(collection(db, "structure_members"), (snapshot) => {
      const membersList = snapshot.docs.map(doc => doc.data());
      const dewanCount = membersList.filter((m: any) => m.divisionId === "inti").length;
      const cadaCount = membersList.filter((m: any) => m.divisionId === "tekpram").length;
      const cabaCount = membersList.filter((m: any) => m.divisionId === "humas").length;

      setStats([
        { label: "Dewan Ambalan", value: `${dewanCount}` },
        { label: "Calon Dewan", value: `${cadaCount}` },
        { label: "Calon Bantara", value: `${cabaCount}` }
      ]);
    });

    // Activities Listener
    const unsubActivities = onSnapshot(doc(db, "content", "activities"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.items) && data.items.length > 0) {
          const formatted = data.items.map((item: any, idx: number) => {
            const def = DEFAULT_ACTIVITIES[idx % DEFAULT_ACTIVITIES.length];
            return {
              url: item.url || (Array.isArray(item.images) && item.images[0]) || def.url,
              images: item.images || [item.url || def.url],
              title: item.title || def.title,
              date: item.date || def.date,
              location: item.location || def.location,
              desc: item.desc || def.desc
            };
          });
          setActivities(formatted);
        }
      }
    });

    return () => {
      unsubHero();
      unsubStats();
      unsubActivities();
    };
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-12 md:pb-20 px-4 sm:px-6 overflow-hidden bg-pramuka-blue-dark">
      {/* Immersive Ambient Glow */}
      <div className="absolute top-1/4 left-1/12 w-72 h-72 rounded-full bg-blue-600/10 blur-[120px] animate-pulse-intense pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-80 h-80 rounded-full bg-indigo-500/10 blur-[130px] animate-float-slow pointer-events-none" />

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Column: Heading & Calls to Action */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-6 sm:mb-8 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-float">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 animate-spin-slow" style={{ animationDuration: "12s" }} />
            TANDANG JUANG MEUNANG
          </div>
          <h1 className="font-display text-2xl xs:text-3xl sm:text-6xl md:text-8xl font-bold leading-[1.15] md:leading-[1] mb-5 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 animate-shimmer-bg tracking-tighter whitespace-pre-line break-words drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            {hero.title}
          </h1>
          <p className="text-sm xs:text-base md:text-xl text-white/50 mb-6 md:mb-10 max-w-lg leading-relaxed font-medium">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
            <Link to="/pendaftaran" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-[2rem] px-6 sm:px-10 py-5 sm:py-8 h-auto text-sm sm:text-lg font-bold gap-3 group shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                {hero.cta}
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/dokumentasi" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-[2rem] px-6 sm:px-8 py-5 sm:py-8 h-auto text-sm sm:text-lg font-bold border-blue-500/30 text-blue-300 hover:border-blue-400 hover:bg-blue-500/10 bg-white/[0.03] transition-all gap-2.5">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                LIHAT DOKUMENTASI
              </Button>
            </Link>
          </div>
          
          <div className="mt-10 md:mt-16 grid grid-cols-3 gap-3 xs:gap-4 md:gap-6 border-t border-white/5 pt-6 md:pt-10">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -6, scale: 1.03 }}
                className="min-w-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="text-xl xs:text-2xl md:text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 truncate group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
                <div className="text-[8px] xs:text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-semibold mt-1 truncate group-hover:text-blue-300 transition-colors duration-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Bento Grid Showcase (Unified Blue Theme) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-lg mx-auto lg:ml-auto w-full"
        >
          {/* Ambient Backlighting in Deep Blue */}
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-blue-600/25 via-blue-500/15 to-transparent blur-2xl pointer-events-none" />

          {/* Bento Card Container */}
          <div className="relative bg-zinc-950/85 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden">
            {/* Header: Title & Total Count Badge */}
            <div className="flex items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                </span>
                <span className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  Dokumentasi Kegiatan
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Images className="w-3 h-3 text-blue-400" />
                  <span>{activities.length} Kegiatan</span>
                </span>
              </div>
            </div>

            {/* Bento Grid 2x2 Layout */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {activities.slice(0, 4).map((act, idx) => {
                const imgCount = Array.isArray(act.images) ? act.images.length : 1;
                return (
                  <Link
                    key={idx}
                    to="/dokumentasi"
                    className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/40 bg-zinc-900 aspect-[4/3] sm:aspect-[4/3] shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 hover:-translate-y-0.5 flex flex-col justify-end"
                  >
                    {/* Activity Image */}
                    <img
                      src={act.url}
                      alt={act.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />

                    {/* Top Badges (Multi-photo Indicator / Location) */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                      {act.location ? (
                        <span className="text-[9px] text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 font-medium truncate max-w-[110px]">
                          <MapPin className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </span>
                      ) : <span />}
                      {imgCount > 1 && (
                        <span className="text-[9px] text-blue-200 bg-blue-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-blue-400/30 flex items-center gap-1 font-bold ml-auto shrink-0">
                          <Images className="w-2.5 h-2.5 text-blue-300" />
                          <span>{imgCount}</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Caption */}
                    <div className="relative z-10 p-2.5 sm:p-3 text-left">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 leading-snug">
                        {act.title}
                      </h4>
                      {act.date && (
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-blue-200/60 mt-1">
                          <Calendar className="w-2.5 h-2.5 text-blue-400" />
                          <span>{act.date}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[11px] text-white/50 hidden xs:inline">
                Klik foto untuk melihat album kegiatan
              </span>
              <Link to="/dokumentasi" className="w-full xs:w-auto">
                <Button
                  size="sm"
                  className="w-full xs:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-4 py-2 text-xs shadow-lg shadow-blue-500/25 border border-blue-400/20 gap-1.5 transition-all cursor-pointer group"
                >
                  <span>Buka Semua Dokumentasi</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
