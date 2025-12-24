import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import zh from "./zh.json";
import en from "./en.json";
import jp from "./jp.json";

const resources = {
  zh: { translation: zh },
  en: { translation: en },
  jp: { translation: jp }
};

const getBrowserLang = () => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("jp")) return "jp";
  return "en";
};


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("lang") || getBrowserLang(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
