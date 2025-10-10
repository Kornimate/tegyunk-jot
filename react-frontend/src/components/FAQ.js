import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_FAQS = [
  {
    id: "q1",
    q: "Hogyan működik a bérlés folyamata?",
    a: "Megrendelés után kollégánk felveszi a kapcsolatot, egyeztetjük a szállítást és az összeszerelést. A díjak a terméktől és a szolgáltatásoktól függően változnak.",
    tags: ["rendezés", "szállítás"],
  },
  {
    id: "q2",
    q: "Mennyi a kórházi ágy havi díja?",
    a: "A havi díj 18 000 - 35 000 Ft, illetve egyszeri szállítási/összeszerelési díj 6 000-12 000 Ft (példa).",
    tags: ["árak"],
  },
  {
    id: "q3",
    q: "Mi a különbség a napi és heti díj között a CPM gépnél?",
    a: "A napi díj rövidebb, alkalmi használatra jó (1 200 - 3 000 Ft/nap), a heti díj kedvezőbb hosszabb bérlés esetén (8 000 - 18 000 Ft/hét).",
    tags: ["árak", "CPM"],
  },
  {
    id: "q4",
    q: "Van-e telefonos támogatás?",
    a: "Igen, ügyfélszolgálatunk elérhető munkaidőben, illetve a sürgős problémákra gyors reagálást biztosítunk.",
    tags: ["támogatás"],
  },
];

export function FAQ({ faqs = SAMPLE_FAQS }) {
  const [openIds, setOpenIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("faq:open") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [query, setQuery] = useState(() => localStorage.getItem("faq:query") || "");
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    localStorage.setItem("faq:open", JSON.stringify(openIds));
  }, [openIds]);

  useEffect(() => {
    localStorage.setItem("faq:query", query);
  }, [query]);

  // derived tags
  const tags = useMemo(() => {
    const s = new Set();
    faqs.forEach((f) => f.tags?.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [faqs]);

  // filtered list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      if (activeTag && !(f.tags || []).includes(activeTag)) return false;
      if (!q) return true;
      return (f.q + " \n " + f.a).toLowerCase().includes(q);
    });
  }, [faqs, query, activeTag]);

  // toggle single
  function toggle(id) {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function openAll() {
    setOpenIds(filtered.map((f) => f.id));
  }
  function closeAll() {
    setOpenIds([]);
  }

  // deep link handling: open if hash matches
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h) setOpenIds((prev) => (prev.includes(h) ? prev : [...prev, h]));
  }, []);

  // keyboard accessibility: open/close with Enter (delegated on button)

  return (
    <div className="max-w-5xl mx-auto px-4 pt-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keresés"
              className="w-full pr-28 rounded-lg border border-gray-200 shadow-sm px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={() => {
                  setQuery("");
                  setActiveTag("");
                }}
                className="px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-200 hover:bg-gray-100"
                title="Törlés"
              >
                Törlés
              </button>
              <button
                onClick={() => openAll()}
                className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:brightness-110"
                title="Összes megnyitása"
              >
                Összes
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Szűrők:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag("")}
              className={`px-3 py-1 rounded-full text-sm ${activeTag === "" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Minden
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag((prev) => (prev === t ? "" : t))}
                className={`px-3 py-1 rounded-full text-sm ${activeTag === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">Nincs találat.</div>
        )}

        {filtered.map((f, idx) => {
          const isOpen = openIds.includes(f.id);
          return (
            <article key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <button
                      aria-expanded={isOpen}
                      aria-controls={`panel-${f.id}`}
                      onClick={() => toggle(f.id)}
                      className="w-full text-left flex items-start gap-3 focus:outline-none"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{f.q}</h3>
                        <div className="mt-1 text-sm text-gray-500">{(f.tags || []).join(" • ")}</div>
                      </div>

                      <div className="flex items-center shrink-0">
                        <span className="sr-only">Toggle</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          className="inline-block bg-indigo-50 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
                          </svg>
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`panel-${f.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          className="mt-3 text-gray-700"
                        >
                          <div className="prose prose-sm max-w-none">{f.a}</div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => navigator.clipboard && navigator.clipboard.writeText(`${window.location.href.split("#")[0]}#${f.id}`)}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Link másolása
                            </button>
                            <button
                              onClick={() => {
                                // pseudo feedback action
                                alert("Köszönjük a visszajelzést!");
                              }}
                              className="text-sm text-indigo-600 hover:underline"
                            >
                              Hasznos volt?
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div>{filtered.length} találat</div>
        <div className="flex gap-2">
          <button onClick={openAll} className="px-3 py-1 rounded-md bg-gray-50 border">Összes megnyitása</button>
          <button onClick={closeAll} className="px-3 py-1 rounded-md bg-gray-50 border">Összes bezárása</button>
        </div>
      </div>
    </div>
  );
}
