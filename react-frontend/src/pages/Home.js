import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../resources/logo.jpg";
import thumbnail from "../resources/thumbnail.jpg"

export function Home() {
  const sections = [
    { id: "home", title: "Kezdőlap" },
    { id: "features", title: "Információ" },
    { id: "gallery", title: "Galéria" },
    { id: "contact", title: "Kapcsolat" },
  ];

  const sectionRefs = useRef({});
  const containerRef = useRef(null);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });

  function goTo(id) {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* NAV / HEADER */}
      <header className="fixed w-full z-40 backdrop-blur-sm/20 top-0 left-0 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => goTo("home")}> 
            <div className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-2xl shadow-md">
              {/* logo */}
              <img width="120" height="120" src={logo} alt="logo" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold">Tegyünk jót</div>
              <div className="text-xs text-gray-500">Kórházi ágy szállítás</div>
            </div>
          </div>

          {/* Tabs / Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className={`relative px-2 py-1 font-medium transition-all ${
                  active === s.id ? "text-gray-900" : "text-gray-500"
                }`}
                aria-current={active === s.id}
              >
                {s.title}
                {/* animated underline */}
                <motion.span
                  layoutId="underline"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`absolute left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 bottom-[-8px] ${
                    active === s.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Mobile menu (simple) */}
          <div className="md:hidden">
            <MobileTabs sections={sections} active={active} goTo={goTo} />
          </div>
        </div>
      </header>

      {/* PAGE CONTENT (scroll container) */}
      <main ref={containerRef} className="pt-20">
        {/* Hero / Thumbnail with parallax */}
        <section
          id="home"
          ref={(el) => (sectionRefs.current["home"] = el)}
          className="min-h-[80vh] snap-start flex items-center"
        >
          <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: text */}
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-extrabold leading-tight"
              >
                Build beautiful frontpages
                <br />with delightful micro-interactions.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-gray-600 max-w-xl"
              >
                A compact React+Tailwind landing page with tabbed navigation, scrolling effects, and soft motion using Framer Motion.
              </motion.p>

              <motion.div className="mt-6 flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <button onClick={() => goTo("features")} className="rounded-lg px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-md hover:scale-[1.01] transform transition">
                  Explore features
                </button>
                <button onClick={() => goTo("gallery")} className="rounded-lg px-5 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                  View gallery
                </button>
              </motion.div>
            </div>

            {/* Right: thumbnail / hero image with subtle parallax */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <ParallaxThumbnail />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" ref={(el) => (sectionRefs.current["features"] = el)} className="min-h-[70vh] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((f, i) => (
                <motion.div key={f.title} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50 mb-4">{f.icon}</div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" ref={(el) => (sectionRefs.current["gallery"] = el)} className="min-h-[70vh] py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-xl overflow-hidden shadow-md bg-white"
                >
                  <img src={img} alt={`gallery ${idx}`} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="font-medium">Sample image #{idx + 1}</div>
                    <div className="text-sm text-gray-500">A pleasant thumbnail with subtle depth.</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" ref={(el) => (sectionRefs.current["contact"] = el)} className="min-h-[50vh] py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input className="col-span-1 md:col-span-2 rounded-lg border p-3" placeholder="Your name" />
              <input className="rounded-lg border p-3" placeholder="Email" />
              <input className="rounded-lg border p-3" placeholder="Subject" />
              <textarea className="col-span-1 md:col-span-2 rounded-lg border p-3 h-32" placeholder="Message" />
              <div className="col-span-1 md:col-span-2">
                <button className="rounded-lg px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-md">Send message</button>
              </div>
            </motion.form>
          </div>
        </section>

        <footer className="py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Aurora UI — built with React + Tailwind + Framer Motion</div>
        </footer>
      </main>
    </div>
  );
}


/* ----------------- Helper components & data ----------------- */

function MobileTabs({ sections, active, goTo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="px-3 py-2 bg-white rounded-lg shadow-md">
        Menu
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg p-3"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  goTo(s.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-2 py-2 rounded-md ${active === s.id ? "bg-gray-100 font-semibold" : "text-gray-600"}`}
              >
                {s.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ParallaxThumbnail() {
  // A thumbnail card with layered parallax using mouse movement
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      el.style.setProperty("--mx", String(x * 18));
      el.style.setProperty("--my", String(y * 12));
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-md rounded-3xl p-1"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="rounded-3xl overflow-hidden bg-white shadow-2xl" style={{ transform: "translateZ(0)" }}>
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d6a7f3b2b2f0c1f6c9a7b8f9052b6b7"
            alt="thumbnail"
            className="w-full h-full object-cover"
            style={{ transform: "translateZ(0)" }}
          />

          {/* layered gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* badge */}
          <div className="absolute left-4 bottom-4 px-3 py-2 rounded-full bg-white/80 backdrop-blur text-sm font-semibold shadow">Thumbnail</div>
        </div>

        <div className="p-4">
          <div className="font-semibold text-lg">Stunning thumbnail</div>
          <p className="text-sm text-gray-500 mt-1">Hover, move the mouse and see the subtle parallax.</p>
        </div>
      </div>

      {/* floating accent */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="absolute -right-8 -top-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-cyan-300 shadow-lg flex items-center justify-center text-white font-bold"
        style={{ transform: "translateZ(40px)" }}
      >
        +24
      </motion.div>
    </motion.div>
  );
}

const featureCards = [
  { title: "Smooth tabs & scroll", text: "Animated tab underline and scrollspy for an intuitive nav.", icon: "✨" },
  { title: "Parallax thumbnails", text: "Layered images with hover parallax and mouse tracking.", icon: "🖼️" },
  { title: "Framer Motion", text: "Soft, natural motion for entrance and micro-interactions.", icon: "⚡" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
  "https://images.unsplash.com/photo-1526318472351-c75fcf0700b9?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
  "https://images.unsplash.com/photo-1495462914368-5f40d6d0b9d6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
];
