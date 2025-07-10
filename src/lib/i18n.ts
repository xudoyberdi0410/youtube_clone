import en from "../../public/locales/en/common.json";
import ru from "../../public/locales/ru/common.json";
import uz from "../../public/locales/uz/common.json";

// Available locales
const locales = {
  en: en as Record<string, string>,
  ru: ru as Record<string, string>,
  uz: uz as Record<string, string>,
};

// Get current language from localStorage or default to 'en'
function getCurrentLanguage(): "en" | "ru" | "uz" {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("language") as "en" | "ru" | "uz") || "en";
}

// Localization function with language switching support
export function t(key: string, vars?: Record<string, string | number>): string {
  const currentLanguage = getCurrentLanguage();
  const locale = locales[currentLanguage];
  let str = locale[key] || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      // Поддержка и {{count}} и {count}
      str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
      str = str.replace(new RegExp(`{\\s*${k}\\s*}`, "g"), String(v));
    });
  }
  return str;
}

// Helper function to set language
export function setLanguage(language: "en" | "ru" | "uz") {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", language);
  }
}

// Helper function to get available languages
export function getAvailableLanguages() {
  return Object.keys(locales);
}
