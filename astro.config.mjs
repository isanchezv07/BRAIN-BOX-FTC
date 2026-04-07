// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://brain-box-ftc.vercel.app',
  output: 'server',
  adapter: vercel(),

  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: true
    },
  },

  integrations: [
    react(), 
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-US' },
      },
      customPages: [
        "https://brain-box-ftc.vercel.app/",
        "https://brain-box-ftc.vercel.app/es/",
        "https://brain-box-ftc.vercel.app/en/",
        "https://brain-box-ftc.vercel.app/es/courses/",
        "https://brain-box-ftc.vercel.app/en/courses/",
        "https://brain-box-ftc.vercel.app/es/docs/",
        "https://brain-box-ftc.vercel.app/en/docs/",
        "https://brain-box-ftc.vercel.app/es/resources/",
        "https://brain-box-ftc.vercel.app/en/resources/",
        "https://brain-box-ftc.vercel.app/es/explore/",
        "https://brain-box-ftc.vercel.app/en/explore/",
        "https://brain-box-ftc.vercel.app/es/scout/",
        "https://brain-box-ftc.vercel.app/en/scout/",
        "https://brain-box-ftc.vercel.app/es/teams/",
        "https://brain-box-ftc.vercel.app/en/teams/",
        "https://brain-box-ftc.vercel.app/es/event/",
        "https://brain-box-ftc.vercel.app/en/event/",
        "https://brain-box-ftc.vercel.app/es/alliance/",
        "https://brain-box-ftc.vercel.app/legal/terms/",
        "https://brain-box-ftc.vercel.app/legal/privacy/",
      ],
      filter: (page) => !page.includes('/auth/callback')
    })
  ],

  vite: {
    plugins: [
      // @ts-ignore 
      tailwindcss(), 
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      },
    },
  },

  devToolbar: {
    enabled: false,
  },
});