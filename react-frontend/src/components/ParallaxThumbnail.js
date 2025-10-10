import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import thumbnail from "../resources/thumbnail.jpg";

export function ParallaxThumbnail() {
  // A thumbnail card with layered parallax using mouse movement
  const ref = useRef(null);
  const { t } = useTranslation();

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
      <div
        className="rounded-3xl overflow-hidden bg-white shadow-2xl"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="relative h-64">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
            style={{ transform: "translateZ(0)" }}
          />

          {/* layered gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* badge */}
          <div className="absolute left-4 bottom-4 px-3 py-2 rounded-full bg-white/80 backdrop-blur text-sm font-semibold shadow">
            {t("thumbnailBadge")}
          </div>
        </div>

        <div className="p-4">
          <div className="font-semibold text-lg">{t("thumbnailTitle")}</div>
          <p className="text-sm text-gray-500 mt-1">
            {t("thumbnailDescription")}
          </p>
        </div>
      </div>

      {/* floating accent */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="absolute -right-6 -top-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-black shadow-lg flex items-center justify-center text-white font-bold"
        style={{ transform: "translateZ(40px)" }}
      >
        +3
      </motion.div>
    </motion.div>
  );
}