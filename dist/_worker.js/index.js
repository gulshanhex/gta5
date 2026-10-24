// Cloudflare Worker Entrypoint generated for Astro + Static Assets (Zero D1, Zero R2)
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/status') {
      return new Response(JSON.stringify({
        status: 'online',
        engine: 'GTA V: Los Santos 3D Web Engine (Astro + Cloudflare Workers)',
        storageMode: 'PUBLIC_STATIC_ASSETS_NO_D1_NO_R2',
        modelsCount: 10
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('GTA V: Los Santos 3D Worker Active', { status: 200 });
  }
};
