// @Isanchezv
// src/i18n/utils.ts
import { ui } from "./ui";

const languages = ["es", "en"] as const;
export type Lang = typeof languages[number];

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  return languages.includes(lang as Lang) ? (lang as Lang) : "es";
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    
    let translation: any = ui[lang];

    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof translation === 'string' ? translation : key;
  };
}