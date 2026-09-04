import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Layers,
  MapPin,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export interface Activity {
  url: string;
  images?: string[];
  title: string;
  date?: string;
  desc?: string;
  location?: string;
}

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    url: "https://images.unsplash.com/photo-1526620536413-5de78833917d?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526620536413-5de78833917d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=1000&auto=format&fit=crop"
    ],
    title: "Latihan Gabungan Pramuka Penegak",
    date: "24 April 2026",
    location: "Lapangan SMKN 2 Garut",
    desc: "Latihan gabungan kepramukaan bersama pangkalan se-Garut. Mengasah keterampilan pionering tiang bendera, morse & semaphore berantai, serta memupuk kekompakan regu. Kobarkan semangat juang tunas kelapa! ⚜️🏕️"
  },
  {
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1000&auto=format&fit=crop"
    ],
    title: "Perkemahan Sabtu Minggu (PERSAMI)",
    date: "08 Mei 2026",
    location: "Bumi Perkemahan Mandalawangi",
    desc: "Membangun kemandirian, kedisiplinan, dan rasa persaudaraan melalui kehidupan alam terbuka. Dari mendirikan tenda komando hingga memasak bekal rimba bersama kawan seperjuangan. 🌲🏕️"
  },
  {
    url: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000&auto=format&fit=crop"
    ],
    title: "Penjelajahan & Survival Rimba",
    date: "12 Maret 2026",
    location: "Kaki Gunung Cikuray, Garut",
    desc: "Uji fisik, navigasi darat dengan kompas bidik, serta pembuatan bivak darurat di kawasan perbukitan Garut. Penegak sejati pantang menyerah di setiap medan juang! 🧭⛰️"
  },
  {
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526620536413-5de78833917d?q=80&w=1000&auto=format&fit=crop"
    ],
    title: "Pelantikan Penegak Bantara",
    date: "19 Februari 2026",
    location: "Aula Utama SMKN 2 Garut",
    desc: "Prosesi sakral pelantikan anggota ambalan baru yang telah menuntaskan Syarat Kecakapan Umum (SKU) tingkat Penegak Bantara. Selamat mengabdi dan mengemban amanah keluhuran tunas kelapa! ⚜️🎖️"
  },
  {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop"
    ],
    title: "Bakti Sosial & Peduli Lingkungan",
    date: "05 Januari 2026",
    location: "Kecamatan Garut Kota",
    desc: "Pramuka hadir nyata di tengah denyut masyarakat. Penyaluran bantuan sembako, kerja bakti kebersihan aliran sungai, dan penanaman bibit pohon penghijauan. Cinta alam dan kasih sayang sesama manusia. 🌱🤝"
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519074069444-1ba4ea16e82a?q=80&w=1000&auto=format&fit=crop"
    ],
    title: "Malam Keakraban & Api Unggun",
    date: "14 Desember 2025",
    location: "Buper Cilopang Garut",
    desc: "Di bawah gemerlap bintang dan hangatnya kobaran api unggun, kami mematri janji persaudaraan sejati. Malam renungan suci, pentas seni kreasi nusantara, dan canda tawa keluarga besar AJM. 🔥✨"
  }
];

export function Dokumentasi() {
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerTitle, setHeaderTitle] = useState("Dokumentasi Kegiatan Ambalan");
  const [headerDesc, setHeaderDesc] = useState("Dokumentasi nyata jejak petualangan, pengabdian, latihan rutin, serta momen seru Ambalan Ir. H. Juanda & Laksamana Malahayati SMKN 2 Garut.");
  
  // Modal Carousel Slider State
  const [selectedActivityIndex, setSelectedActivityIndex] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(0);

  useEffect(() => {
    // Listen to direct content updates from Firestore
    const unsub = onSnapshot(doc(db, "content", "activities"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.headerTitle) {
          setHeaderTitle(data.headerTitle);
        }
        if (data.headerDesc) {
          setHeaderDesc(data.headerDesc);
        }
        if (Array.isArray(data.items)) {
          const formatted = data.items.map((item: any, idx: number) => {
            const originalDefault = DEFAULT_ACTIVITIES[idx % DEFAULT_ACTIVITIES.length];
            
            // Build array of images (handling both images[] and legacy url)
            let imgs: string[] = [];
            if (Array.isArray(item.images) && item.images.length > 0) {
              imgs = item.images.filter((img: string) => Boolean(img && img.trim()));
            } else if (item.url && item.url.trim()) {
              imgs = [item.url.trim()];
            } else if (originalDefault?.images && originalDefault.images.length > 0) {
              imgs = originalDefault.images;
            } else {
              imgs = ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop"];
            }

            return {
              url: imgs[0] || item.url || originalDefault?.url,
              images: imgs,
              title: item.title || `Kegiatan ${idx + 1}`,
              date: item.date || originalDefault?.date || "Dokumentasi Kegiatan",
              desc: item.desc || originalDefault?.desc || "Momen kegiatan kepramukaan Ambalan AJM SMKN 2 Garut.",
              location: item.location || originalDefault?.location || "SMKN 2 Garut"
            };
          });
          setActivities(formatted);
        }
      }
    });

    return () => unsub();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const title = activity.title || "";
    const desc = activity.desc || "";
    const loc = activity.location || "";
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || loc.toLowerCase().includes(q);
  });

  const selectedActivity = selectedActivityIndex !== null ? filteredActivities[selectedActivityIndex] : null;
  const currentImages = selectedActivity?.images && selectedActivity.images.length > 0 
    ? selectedActivity.images 
    : (selectedActivity?.url ? [selectedActivity.url] : []);

  const handleOpenActivity = (index: number) => {
    setSelectedActivityIndex(index);
    setCurrentSlideIndex(0);
    setSlideDirection(0);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentImages.length <= 1) return;
    setSlideDirection(1);
    setCurrentSlideIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentImages.length <= 1) return;
    setSlideDirection(-1);
    setCurrentSlideIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const handleGoToSlide = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
  };

  const handleNextActivity = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedActivityIndex === null) return;
    const nextIdx = (selectedActivityIndex + 1) % filteredActivities.length;
    setSelectedActivityIndex(nextIdx);
    setCurrentSlideIndex(0);
    setSlideDirection(0);
  };

  const handlePrevActivity = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedActivityIndex === null) return;
    const prevIdx = (selectedActivityIndex - 1 + filteredActivities.length) % filteredActivities.length;
    setSelectedActivityIndex(prevIdx);
    setCurrentSlideIndex(0);
    setSlideDirection(0);
  };

  // Keyboard navigation for carousel slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedActivityIndex === null) return;
      if (e.key === "Escape") {
        setSelectedActivityIndex(null);
      } else if (e.key === "ArrowRight") {
        if (currentImages.length > 1 && currentSlideIndex < currentImages.length - 1) {
          handleNextSlide();
        } else {
          handleNextActivity();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentImages.length > 1 && currentSlideIndex > 0) {
          handlePrevSlide();
        } else {
          handlePrevActivity();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedActivityIndex, currentSlideIndex, currentImages.length]);

  return (
    <div className="min-h-screen bg-pramuka-blue-dark text-white relative pt-24 sm:pt-28 pb-20 px-4 sm:px-6 md:px-8">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation Bar */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 hover:bg-white/10 text-white gap-2 rounded-xl text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <div className="text-xs text-white/40 font-mono hidden sm:flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{activities.length} Kegiatan Terdokumentasi</span>
          </div>
        </div>

        {/* Header Section (Original Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-blue-500 rounded-full inline-block"></span>
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase font-mono">
                Galeri & Dokumentasi
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display tracking-tight">
              {headerTitle}
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              {headerDesc}
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Cari kegiatan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-blue-500/30 focus:border-blue-500/50 outline-none rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-white/30 text-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Empty Search State */}
        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl p-8"
          >
            <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4 animate-bounce" />
            <p className="text-lg font-bold text-white mb-2">Dokumentasi Tidak Ditemukan</p>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Tidak ada kegiatan yang cocok dengan kata kunci "{searchQuery}".
            </p>
          </motion.div>
        )}

        {/* Original Concept Card Grid */}
        {filteredActivities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => {
                const images = activity.images && activity.images.length > 0 
                  ? activity.images 
                  : (activity.url ? [activity.url] : []);
                const isMultiPhoto = images.length > 1;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    onClick={() => handleOpenActivity(index)}
                    className="glass-card bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                  >
                    <div>
                      {/* Image Container with 16:9 Aspect Ratio */}
                      <div className="aspect-video w-full overflow-hidden relative bg-black/40">
                        <img
                          src={images[0] || activity.url}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />

                        {/* Multi-Photo Slide Indicator Badge (Top Right) */}
                        {isMultiPhoto && (
                          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/15 shadow-md">
                            <Layers className="w-3.5 h-3.5 text-blue-400" />
                            <span>{images.length} Foto</span>
                          </div>
                        )}

                        {/* Hover Overlay Prompt */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5 shadow-lg">
                            <ExternalLink className="w-3.5 h-3.5" />
                            {isMultiPhoto ? "Buka & Slide Foto" : "Lihat Detail"}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-2 mb-2.5 text-xs">
                          {activity.date && (
                            <div className="flex items-center gap-1.5 text-blue-400/90 font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{activity.date}</span>
                            </div>
                          )}
                          {activity.location && (
                            <div className="flex items-center gap-1 text-white/40 truncate text-[11px]">
                              <MapPin className="w-3 h-3 text-white/30 shrink-0" />
                              <span className="truncate max-w-[140px]">{activity.location}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 mb-2">
                          {activity.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-white/60 line-clamp-2 leading-relaxed">
                          {activity.desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-5 sm:px-6 pb-5 pt-0 flex items-center justify-between text-xs text-white/40 border-t border-white/5 mt-auto pt-3">
                      <span className="text-[11px] font-mono text-white/30">PRAMUKA SMKN 2 GARUT</span>
                      <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-medium flex items-center gap-1">
                        Lihat {isMultiPhoto ? `(${images.length} Foto)` : ""} &rarr;
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal View with Multi-Photo Slide Carousel (Slide Ke Pinggir seperti Postingan Instagram) */}
      <AnimatePresence>
        {selectedActivityIndex !== null && selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedActivityIndex(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8"
          >
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[92vh] bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button Top Right */}
              <button
                onClick={() => setSelectedActivityIndex(null)}
                className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer shadow-lg"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT/MAIN: Photo Slider Carousel (Slide Ke Pinggir) */}
              <div className="relative w-full md:w-[62%] h-[320px] sm:h-[400px] md:h-auto min-h-[320px] md:min-h-[520px] bg-black flex items-center justify-center select-none overflow-hidden group">
                {/* Horizontal Slide Display with AnimatePresence */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <AnimatePresence initial={false} custom={slideDirection}>
                    <motion.div
                      key={currentSlideIndex}
                      custom={slideDirection}
                      variants={{
                        enter: (direction: number) => ({
                          x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
                          opacity: 0
                        }),
                        center: {
                          zIndex: 1,
                          x: 0,
                          opacity: 1
                        },
                        exit: (direction: number) => ({
                          zIndex: 0,
                          x: direction < 0 ? "100%" : "-100%",
                          opacity: 0
                        })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="absolute inset-0 flex items-center justify-center p-2 sm:p-4"
                    >
                      <img
                        src={currentImages[currentSlideIndex]}
                        alt={`${selectedActivity.title} - Foto ${currentSlideIndex + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Multi-Photo Slide Counter Badge (e.g. 1 / 3) */}
                {currentImages.length > 1 && (
                  <div className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-bold text-white border border-white/20 shadow-lg flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>{currentSlideIndex + 1} / {currentImages.length}</span>
                  </div>
                )}

                {/* Carousel Left Slide Navigation Arrow */}
                {currentImages.length > 1 && currentSlideIndex > 0 && (
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/95 border border-white/20 flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                    title="Slide Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Carousel Right Slide Navigation Arrow */}
                {currentImages.length > 1 && currentSlideIndex < currentImages.length - 1 && (
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/95 border border-white/20 flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                    title="Slide Foto Berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Dots Pagination Indicator (Titik Bulat Slide) */}
                {currentImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {currentImages.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={(e) => handleGoToSlide(dotIdx, e)}
                        className={`transition-all rounded-full cursor-pointer ${
                          dotIdx === currentSlideIndex
                            ? "w-5 h-1.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.7)]"
                            : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                        title={`Lompat ke foto ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT/INFO: Activity Details & Navigation */}
              <div className="w-full md:w-[38%] bg-zinc-950 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 overflow-hidden">
                {/* Header Information */}
                <div className="p-5 sm:p-6 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedActivity.date || "Dokumentasi Ambalan"}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-display tracking-tight leading-snug">
                    {selectedActivity.title}
                  </h2>
                  {selectedActivity.location && (
                    <div className="flex items-center gap-1.5 text-xs text-white/50 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-400/80 shrink-0" />
                      <span>{selectedActivity.location}</span>
                    </div>
                  )}
                </div>

                {/* Description Body & Thumbnails */}
                <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-white/80 scrollbar-thin scrollbar-thumb-white/10">
                  {selectedActivity.desc ? (
                    <p className="whitespace-pre-line text-white/80 leading-relaxed">
                      {selectedActivity.desc}
                    </p>
                  ) : (
                    <p className="text-white/40 italic">
                      Tidak ada deskripsi tambahan untuk kegiatan ini.
                    </p>
                  )}

                  {/* Multi-Photo Thumbnails Strip */}
                  {currentImages.length > 1 && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                        Pilih Foto Slide ({currentImages.length})
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {currentImages.map((thumbUrl, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={(e) => handleGoToSlide(tIdx, e)}
                            className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                              tIdx === currentSlideIndex
                                ? "border-blue-400 ring-2 ring-blue-400/40 scale-105"
                                : "border-white/15 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Semboyan Quote */}
                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-white/50 text-[11px] leading-relaxed italic">
                    "Tandang, Juang, Meunang. Menempa jiwa ksatria pramuka yang berintegritas dan berbudi luhur."
                  </div>
                </div>

                {/* Footer Switcher to Next/Previous Activity */}
                <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/60">
                  <button
                    onClick={handlePrevActivity}
                    className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                  <span className="font-mono text-[11px] text-white/40">
                    {selectedActivityIndex + 1} dari {filteredActivities.length}
                  </span>
                  <button
                    onClick={handleNextActivity}
                    className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Sparkles,
  Camera,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface Activity {
  url: string;
  title: string;
  date?: string;
  desc?: string;
}

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    url: "https://images.unsplash.com/photo-1526620536413-5de78833917d?q=80&w=1000&auto=format&fit=crop",
    title: "Latihan Gabungan Pramuka",
    date: "24 April 2026",
    desc: "Latihan bersama meningkatkan keterampilan kepramukaan dan sinergi antar pangkalan."
  },
  {
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop",
    title: "Perkemahan Sabtu Minggu (PERSAMI)",
    date: "08 Mei 2026",
    desc: "Membangun kemandirian, kedisiplinan, dan rasa persaudaraan melalui kehidupan alam terbuka."
  },
  {
    url: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=1000&auto=format&fit=crop",
    title: "Penjelajahan & Survival Alam",
    date: "12 Maret 2026",
    desc: "Uji fisik dan navigasi darat dalam penjelajahan pegunungan daerah Garut."
  },
  {
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
    title: "Pelantikan Penegak Bantara",
    date: "19 Februari 2026",
    desc: "Prosesi sakral pelantikan anggota ambalan baru yang berintegritas tinggi."
  },
  {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    title: "Kegiatan Bakti Sosial Komunitas",
    date: "05 Januari 2026",
    desc: "Pramuka hadir di tengah masyarakat membantu sirkulasi ketahanan pangan warga setempat."
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
    title: "Malam Keakraban Ambalan",
    date: "14 Desember 2025",
    desc: "Api unggun persaudaraan, refleksi juang, dan pentas seni kreativitas ambalan."
  }
];

export function Dokumentasi() {
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [headerTitle, setHeaderTitle] = useState("Dokumentasi Kegiatan Ambalan");
  const [headerDesc, setHeaderDesc] = useState("Dokumentasi nyata jejak petualangan, pengabdian, latihan rutin, serta momen seru Ambalan Ir. H. Juanda & Laksamana Malahayati SMKN 2 Garut.");

  useEffect(() => {
    // Listen to direct content updates from Firestore
    const unsub = onSnapshot(doc(db, "content", "activities"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.headerTitle) {
          setHeaderTitle(data.headerTitle);
        }
        if (data.headerDesc) {
          setHeaderDesc(data.headerDesc);
        }
        if (Array.isArray(data.items)) {
          // Merge metadata fields if they exist, or supply default dates & descriptions dynamically
          const formatted = data.items.map((item: any, idx: number) => {
            const originalDefault = DEFAULT_ACTIVITIES[idx % DEFAULT_ACTIVITIES.length];
            return {
              url: item.url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop",
              title: item.title || `Kegiatan ${idx + 1}`,
              date: item.date || originalDefault?.date || "20 Momen Terbaik",
              desc: item.desc || originalDefault?.desc || "Momen kegiatan kepramukaan Ambalan AJM SMKN 2 Garut yang penuh nilai perjuangan."
            };
          });
          setActivities(formatted);
        }
      }
    });

    return () => unsub();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const title = activity.title || "";
    const desc = activity.desc || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredActivities.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(
      (selectedPhotoIndex - 1 + filteredActivities.length) % filteredActivities.length
    );
  };

  // Close lightbox on keydown Escape and support slider navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") setSelectedPhotoIndex(null);
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex]);

  return (
    <div className="min-h-screen bg-pramuka-blue-dark text-white relative pt-28 pb-16 px-4 sm:px-6 md:px-8">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none animate-pulse-intense" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-amber-500/5 blur-[140px] pointer-events-none animate-float-slow" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation Button */}
        <div className="mb-6 sm:mb-8">
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-white/10 text-white hover:bg-white/10 bg-transparent py-4 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        {/* Dynamic Header */}
        <div className="text-center md:text-left mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 border border-blue-500/20 shadow-md">
              <Camera className="w-3.5 h-3.5" />
              GALERI DOKUMENTASI
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-300 animate-shimmer-bg bg-size-200 tracking-tighter">
              {headerTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/50 leading-relaxed font-medium">
              {headerDesc}
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Cari dokumentasi kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-blue-500/30 focus:border-blue-500/50 outline-none rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-white/30 text-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Empty Search State */}
        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl p-8"
          >
            <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4 animate-bounce" />
            <p className="text-lg font-bold text-white mb-2">Dokumentasi Tidak Ditemukan</p>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Tidak ada dokumentasi kegiatan dengan kata kunci "{searchQuery}". Coba masukkan kata kunci yang berbeda.
            </p>
          </motion.div>
        )}

        {/* Photos Album Grid Box */}
        {filteredActivities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="group bg-white/[0.02] border border-white/5 hover:border-blue-500/30 rounded-3xl p-3 sm:p-4 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] cursor-pointer transition-all duration-300 flex flex-col h-full"
                >
                  {/* Photo Frame Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
                    <img
                      src={activity.url}
                      alt={activity.title}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Play Button Glow Backlighting */}
                    <div className="absolute inset-0 bg-pramuka-blue-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg animate-pulse scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Date Badge overlay */}
                    {activity.date && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-bold text-amber-400 border border-white/10 uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {activity.date}
                      </div>
                    )}
                  </div>

                  {/* Photo Details (Aesthetic Polaroid Layout) */}
                  <div className="pt-4 pb-1 pl-1 flex flex-col flex-grow">
                    <h3 className="font-display font-bold text-base text-white tracking-tight leading-tight mb-2 group-hover:text-blue-300 transition-colors truncate">
                      {activity.title}
                    </h3>
                    <p className="text-xs text-white/40 font-medium leading-relaxed line-clamp-2 mt-auto">
                      {activity.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Detail Album</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox / Enlarged Photo Carousel Overlay with backdrop-blur */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-10 select-none"
          >
            {/* Lightbox Header Controls */}
            <div className="flex items-center justify-between text-white/60 w-full relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono tracking-widest bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                  PHOTO {selectedPhotoIndex + 1} OF {filteredActivities.length}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(null);
                }}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Principal Picture Body Carousel */}
            <div className="flex-grow w-full max-w-5xl mx-auto flex items-center justify-between gap-4 py-4 relative">
              {/* Left Carousel Navigation Trigger */}
              <button
                onClick={handlePrevPhoto}
                className="hidden sm:flex w-12 h-12 rounded-full bg-white/5 hover:bg-blue-600/90 border border-white/10 items-center justify-center text-white transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              {/* Main Active Picture */}
              <div className="flex-grow flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[65vh] relative max-w-[90%] mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPhotoIndex}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full flex items-center justify-center pointer-events-none"
                  >
                    <img
                      src={filteredActivities[selectedPhotoIndex].url}
                      alt={filteredActivities[selectedPhotoIndex].title}
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Carousel Navigation Trigger */}
              <button
                onClick={handleNextPhoto}
                className="hidden sm:flex w-12 h-12 rounded-full bg-white/5 hover:bg-blue-600/90 border border-white/10 items-center justify-center text-white transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            {/* Carousel Polaroid Description Card (Footer) */}
            <div className="w-full max-w-3xl mx-auto bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center shadow-2xl relative z-10 transition-all duration-300">
              <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Ambalan Ir. H. Juanda - Laksamana Malahayati
              </div>
              <h2 className="font-display font-bold text-base sm:text-xl text-white tracking-tight mb-2 sm:mb-3">
                {filteredActivities[selectedPhotoIndex].title}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
                {filteredActivities[selectedPhotoIndex].desc}
              </p>
              
              {/* Mobile Swipe / Tap Assistant Indicators */}
              <div className="flex sm:hidden items-center justify-between gap-2 mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={handlePrevPhoto}
                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase text-white/80 active:bg-blue-600"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>
                <span className="text-[10px] font-mono text-white/30">
                  {selectedPhotoIndex + 1} / {filteredActivities.length}
                </span>
                <button
                  onClick={handleNextPhoto}
                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase text-white/80 active:bg-blue-600"
                >
                  Berikutnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
