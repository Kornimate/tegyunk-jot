import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();

  function isLanguageHungarian() {
    const language = localStorage.getItem("lang");
    return language === "hu" || language === null;
  }

  function changeLanguageToEnglish() {
    i18n.changeLanguage("en");
  }

  function changeLanguageToHungarian() {
    i18n.changeLanguage("hu");
  }

  return (
    <>
      {isLanguageHungarian() ? (
        <button
          className="relative px-2 py-1 font-medium transition-all text-gray-500"
          onClick={changeLanguageToEnglish}
        >
          <ReactCountryFlag
            countryCode="GB"
            svg
            style={{ width: "1.5em", height: "1.5em" }}
          />
        </button>
      ) : (
        <button
          className="relative px-2 py-1 font-medium transition-all text-gray-500"
          onClick={changeLanguageToHungarian}
        >
          <ReactCountryFlag
            countryCode="HU"
            svg
            style={{ width: "1.5em", height: "1.5em" }}
          />
        </button>
      )}
    </>
  );
}