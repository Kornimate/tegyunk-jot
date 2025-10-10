import { useTranslation } from "react-i18next";
import { FeedbackCard } from "./FeedbackCard";

export function FeedbackList() {
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
