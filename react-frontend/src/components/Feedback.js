import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function FeedbackCard({ avatar, name, date, rating, text, index }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const displayText = expanded ? text : text.slice(0, 120);

  function StarRating({ rating }) {
    return (
      <div className="text-yellow-400 flex">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="text-lg">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl hover:scale-105 transition-transform duration-300 justify-"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatar || "https://via.placeholder.com/150"}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{date}</div>
          </div>
        </div>
        <StarRating rating={rating} />
      </div>

      {/* Feedback text */}
      <p className="text-gray-700 whitespace-pre-line">
        {displayText}
        {text.length > 120 && !expanded && (
          <span
            onClick={() => setExpanded(true)}
            className="text-blue-500 cursor-pointer ml-1"
          >
            ...{t("readmore")}
          </span>
        )}
        {expanded && text.length > 120 && (
          <span
            onClick={() => setExpanded(false)}
            className="text-blue-500 cursor-pointer ml-1"
          >
            {t("showless")}
          </span>
        )}
      </p>
    </motion.div>
  );
}

export default function FeedbackList() {
  const { t } = useTranslation();

    const feedbacks = [
    {
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Kovács Éva",
      date: "2025. 09. 03.",
      rating: 5,
      text: t("review1"),
    },
    {
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Kovács Márk",
      date: "2025. 09. 17.",
      rating: 5,
      text: t("review2"),
    },
    {
      avatar: "https://randomuser.me/api/portraits/men/20.jpg",
      name: "Kocsis Endre",
      date: "2025. 10. 01.",
      rating: 4,
      text: t("review3"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-12 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedbacks.map((f, idx) => (
        <FeedbackCard key={idx} {...f} index={idx} />
      ))}
    </div>
  );
}
