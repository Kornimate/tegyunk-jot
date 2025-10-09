import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import hu from "../locales/hu.json";

const langKey = "lang";

i18n.use(initReactI18next).init({
  resources: {
    hu: { translation: hu },
    en: { translation: en },
  },
  lng: "hu", // default language
  fallbackLng: "hu", // fallback if translation missing
  interpolation: { escapeValue: false },
});

const language = localStorage.getItem(langKey);

if (language === null) {
  localStorage.setItem(langKey, "hu");
} else {
  i18n.changeLanguage(language);
}

i18n.on("languageChanged", (lng) => localStorage.setItem(langKey, lng));

export default i18n;
