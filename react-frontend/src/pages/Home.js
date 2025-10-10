import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import logo from "../resources/logo_no_text.png";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../components/LanguageSelector";
import { MobileTabs } from "../components/MobileTabs";
import { ParallaxThumbnail } from "../components/ParallaxThumbnail";
import { PricingList } from "../components/PricingList";
import { Announcement } from "../components/Announcement";
import FeedbackList from "../components/Feedback";
import { FAQ } from "../components/FAQ";
import { Profile } from "../components/Profile";

export function Home() {
  const { t } = useTranslation();

  const sections = [
    { id: "home", title: t("startPage") },
    { id: "services", title: t("services") },
    { id: "pricing", title: t("pricing") },
    { id: "about", title: t("about") },
    { id: "faq", title: t("faq") },
    { id: "contact", title: t("contact") },
  ];

  const featureCards = [
    {
      title: t("featureBedTitle"),
      text: t("featureBedDesc"),
      icon: "🛏️",
    },
    {
      title: t("featureCRMTitle"),
      text: t("featureCRMDesc"),
      icon: "⚙️",
    },
    {
      title: t("featureShippingTitle"),
      text: t("featureShippingDesc"),
      icon: "🚚",
    },
    {
      title: t("featureCleaningTitle"),
      text: t("featureCleaningDesc"),
      icon: "✨",
    },
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
    const yOffset = -100;
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* NAV / HEADER */}
      <header className="fixed w-full z-40 backdrop-blur-sm/20 top-0 left-0 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => goTo("home")}
          >
            <div className="w-10 h-10 flex items-center justify-center p-[3px] rounded-md bg-gradient-to-r from-red-500 to-black">
              {/* logo */}
              <img
                width="120"
                height="120"
                src={logo}
                alt="logo"
                className="rounded"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold">{t("companyName")}</div>
              <div className="text-xs text-gray-500">{t("companySlogen")}</div>
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
                  className={`absolute left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-red-500 to-black bottom-[-8px] ${
                    active === s.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
            <LanguageSelector />
            <Profile />
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
          className="min-h-[90vh] snap-start flex items-center"
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
                {t("title")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-gray-600 max-w-xl text-center"
              >
                {t("shortIntro") + " " + t("longIntro")}
              </motion.p>

              <motion.div
                className="mt-6 flex gap-3 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => goTo("contact")}
                  className="rounded-lg px-5 py-2 bg-gradient-to-r from-red-500 to-black text-white font-semibold shadow-md hover:scale-[1.01] transform transition"
                >
                  {t("btnOrder")}
                </button>
                <button
                  onClick={() => goTo("services")}
                  className="rounded-lg px-5 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  {t("btnServices")}
                </button>
              </motion.div>
            </div>

            {/* Right: thumbnail / hero image with subtle parallax */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <ParallaxThumbnail />
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          ref={(el) => (sectionRefs.current["services"] = el)}
          className="min-h-[50vh] pt-10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">{t("servicesTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featureCards.map((f, _) => (
                <motion.div
                  key={f.title}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50 mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p
                    className="mt-2 text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: f.text }}
                  ></p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          ref={(el) => (sectionRefs.current["pricing"] = el)}
          className="min-h-[70vh] py-10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">{t("pricingTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
              <PricingList />
            </div>
            <Announcement
              type="info"
              message={t("infoAboutPrices")}
              extraStyle="mb-4 mt-10"
            />
            <Announcement
              type="info"
              message={t("infoAboutFlexibility")}
              extraStyle="mt-4"
            />
            <Announcement
              type="warning"
              message={t("infoAboutReliability")}
              extraStyle="mt-4"
            />
          </div>
        </section>

        {/* ABOUT US */}
        <section
          id="about"
          ref={(el) => (sectionRefs.current["about"] = el)}
          className="min-h-[60vh] py-10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">{t("aboutTitle")}</h2>
            <motion.div>{t("aboutDesc")}</motion.div>
            <h2 className="text-2xl font-bold mt-10 mb-4">{t("processTitle")}</h2>
            <motion.div
              dangerouslySetInnerHTML={{ __html: t("processDesc") }}
            ></motion.div>
            <h2 className="text-2xl font-bold mt-10">{t("feedbackTitle")}</h2>
            <FeedbackList />
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          ref={(el) => (sectionRefs.current["faq"] = el)}
          className="min-h-[70vh] py-24"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">{t("faqTitle")}</h2>
            <FAQ />
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          ref={(el) => (sectionRefs.current["contact"] = el)}
          className="min-h-[50vh] py-10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="col-span-1 md:col-span-2 rounded-lg border p-3"
                placeholder="Your name"
              />
              <input className="rounded-lg border p-3" placeholder="Email" />
              <input className="rounded-lg border p-3" placeholder="Subject" />
              <textarea
                className="col-span-1 md:col-span-2 rounded-lg border p-3 h-32"
                placeholder="Message"
              />
              <div className="col-span-1 md:col-span-2">
                <button className="rounded-lg px-5 py-2 bg-gradient-to-r from-red-500 to-black text-white font-semibold shadow-md">
                  Send message
                </button>
              </div>
            </motion.form>
          </div>
        </section>

        <footer className="py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Tegyünk Jót
          </div>
        </footer>
      </main>
    </div>
  );
}
