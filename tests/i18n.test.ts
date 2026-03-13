import { describe, it, expect } from 'vitest';
// Apuntando a tus utilidades reales
import { getLangFromUrl, useTranslations } from '../src/i18n/utils';

describe('🌐 Sistema de Idiomas (i18n)', () => {
  it('debería detectar "es" desde una URL de Astro', () => {
    const url = new URL('https://brain-box-ftc.vercel.app/es/dashboard');
    const lang = getLangFromUrl(url);
    expect(lang).toBe('es');
  });

  it('debería retornar las traducciones correctas para UI', () => {
    const translate = useTranslations('es');
    // Asegúrate de que esta llave exista en tu es.json
    const text = translate('nav.dashboard') || translate('dashboard.title'); 
    expect(text).toBeDefined();
  });
});