export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Interceptar /config.js
        if (url.pathname === '/config.js') {
            const configContent = `// config.js - Generado por Cloudflare Pages
const SUPABASE_URL = '${env.SUPABASE_URL}';
const SUPABASE_KEY = '${env.SUPABASE_KEY}';
const CLOUDFLARE_KEY = '${env.PORTAL_KEY}';
`;
            return new Response(configContent, {
                headers: {
                    'Content-Type': 'application/javascript; charset=utf-8',
                    'Cache-Control': 'no-cache'
                }
            });
        }

        // Interceptar /config-admin.js
        if (url.pathname === '/config-admin.js') {
            const configContent = `// config-admin.js - Generado por Cloudflare Pages
const CLOUDFLARE_SECRET_KEY = '${env.ADMIN_KEY}';
const CLOUDFLARE_KEY_MURAL = '${env.ADMIN_KEY}';
`;
            return new Response(configContent, {
                headers: {
                    'Content-Type': 'application/javascript; charset=utf-8',
                    'Cache-Control': 'no-cache'
                }
            });
        }

        // Todo lo demás: servir el asset estático
        return env.ASSETS.fetch(request);
    }
};