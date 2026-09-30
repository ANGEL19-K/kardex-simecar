export async function onRequest(context) {
    const configContent = `
// config-admin.js - Generado por Cloudflare Pages Functions
const CLOUDFLARE_SECRET_KEY = '${context.env.ADMIN_KEY}';
const CLOUDFLARE_KEY_MURAL = '${context.env.ADMIN_KEY}';
`;

    return new Response(configContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache'
        }
    });
}