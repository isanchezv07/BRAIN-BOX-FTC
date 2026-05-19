// @Isanchezv
// src/pages/[locale]/api/stripe/webhook.ts
import { POST as originalPOST } from '../../../api/stripe/webhook';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
  console.log(`[WEBHOOK i18n] Handling prefixed webhook: ${context.url.pathname}`);
  return originalPOST(context);
};
