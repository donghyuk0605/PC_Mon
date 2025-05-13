// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationJa from "./locales/ja/translation.json";
import translationKo from "./locales/ko/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: translationKo },
    ja: { translation: translationJa },
  },
  lng: "ko", // 초기 언어
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
