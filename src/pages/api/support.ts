import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const subject = formData.get('subject')?.toString();
    const message = formData.get('message')?.toString();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Brain Box Support <onboarding@resend.dev>',
      to: ['brain.box.ftc.support@gmail.com'],
      subject: `[CORE_SUPPORT] ${subject.toUpperCase()} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Inter', sans-serif; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                  
                  <!-- Header Decorator -->
                  <tr>
                    <td height="4" style="background: linear-gradient(90deg, #2563eb, #7c3aed);"></td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <!-- Logo/Brand -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td>
                            <h1 style="margin: 0; font-size: 24px; font-weight: 900; italic: true; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                              BRAIN <span style="color: #2563eb;">BOX</span> <span style="font-size: 12px; color: #4b5563; font-weight: 400; letter-spacing: 4px;">FTC</span>
                            </h1>
                          </td>
                          <td align="right">
                            <span style="font-size: 10px; color: #2563eb; font-weight: 900; border: 1px solid rgba(37,99,235,0.3); padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px;">
                              Soporte Técnico
                            </span>
                          </td>
                        </tr>
                      </table>

                      <div style="margin-top: 40px; height: 1px; background-color: #1a1a1a;"></div>

                      <!-- Report Details -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
                        <tr>
                          <td style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 10px; font-weight: 900; color: #2563eb; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Remitente</p>
                            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #ffffff;">${name}</p>
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">${email}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 10px; font-weight: 900; color: #2563eb; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Categoría de Incidencia</p>
                            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #ffffff; text-transform: uppercase;">${subject}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Message Box -->
                      <div style="margin-top: 20px; background-color: #050505; border: 1px solid #1a1a1a; border-radius: 16px; padding: 24px;">
                        <p style="margin: 0; font-size: 10px; font-weight: 900; color: #4b5563; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">Detalles del Mensaje</p>
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #d1d5db; white-space: pre-wrap;">${message}</p>
                      </div>

                      <!-- Footer Info -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                        <tr>
                          <td align="center" style="padding: 20px; border-top: 1px solid #1a1a1a;">
                            <p style="margin: 0; font-size: 10px; color: #4b5563; text-transform: uppercase; letter-spacing: 1px;">
                              Este es un reporte automático generado por el sistema de Brain Box FTC.
                            </p>
                            <p style="margin: 4px 0 0 0; font-size: 10px; color: #2563eb; font-weight: 700;">
                              v2.1.1 // ENGINEERING_CORE
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
