// @Isanchezv
// src/i18n/ui.ts
import english from './en.json';
import es from './es.json';

export const languages = {
    en: 'English',
    es: 'Español',
  };
  
  export const defaultLang = 'es';
  
  export const ui = {
    en: english,
    es: es,
    
} as const;