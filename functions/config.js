// v3
export async function onRequest(context) {
    const configContent = `
// config.js - Generado por Cloudflare Pages Functions
const SUPABASE_URL = '${context.env.SUPABASE_URL}';
const SUPABASE_KEY = '${context.env.SUPABASE_KEY}';
const CLOUDFLARE_KEY = '${context.env.PORTAL_KEY}';
const CLOUDFLARE_KEY_MURAL = '${context.env.PORTAL_KEY}';
`;
    return new Response(configContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache'
        }
    });
}
