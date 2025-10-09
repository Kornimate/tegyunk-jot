import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelector } from "./LanguageSelector";

export function MobileTabs({ sections, active, goTo }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 bg-white rounded-lg shadow-md"
      >
        {t("menu")}
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
                className={`w-full text-left px-2 py-2 rounded-md ${
                  active === s.id
                    ? "bg-gray-100 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {s.title}
              </button>
            ))}
          </motion.div>
        )}
        <LanguageSelector />
      </AnimatePresence>
    </div>
  );
}