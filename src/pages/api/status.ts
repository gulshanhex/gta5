import type { APIRoute } from 'astro';

export const prerender = false;

// In-memory edge leaderboard (runs in Cloudflare Worker isolate without D1 or R2)
const EDGE_LEADERBOARD = [
  { crew: 'LosSantosLegends', character: 'Michael', heist: 'Union Depository Gold Heist', payout: 1000000, timeSec: 142 },
  { crew: 'VinewoodDrifters', character: 'Franklin', heist: 'Vangelico Jewelry Heist', payout: 250000, timeSec: 94 },
  { crew: 'TrevorPhilipsIndustries', character: 'Trevor', heist: 'Sandy Shores Arms Run', payout: 120000, timeSec: 78 },
];

export const GET: APIRoute = async ({ request }) => {
  const cf = (request as any).cf || {};
  return new Response(
    JSON.stringify({
      status: 'online',
      engine: 'GTA V: Los Santos 3D Web Engine (Astro + Cloudflare Workers)',
      storageMode: 'Public Static Assets (Zero D1, Zero R2)',
      edgeLocation: cf.colo || 'LOCAL-EDGE',
      country: cf.country || 'IN',
      modelsManifest: [
        '/models/character_michael.glb',
        '/models/character_franklin.glb',
        '/models/character_trevor.glb',
        '/models/vehicle_sportscar.glb',
        '/models/vehicle_muscle.glb',
        '/models/vehicle_police.glb',
        '/models/vehicle_helicopter.glb',
        '/models/vehicle_motorcycle.glb',
        '/models/weapon_pack.glb',
        '/models/city_landmarks.glb',
      ],
      texturesManifest: [
        '/textures/los_santos_hero.jpg',
        '/textures/road_asphalt.png',
        '/textures/building_facade.png',
        '/textures/terrain_grass.png',
      ],
      leaderboard: EDGE_LEADERBOARD,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (body && body.crew && body.heist) {
      EDGE_LEADERBOARD.unshift({
        crew: String(body.crew).slice(0, 24),
        character: String(body.character || 'Michael'),
        heist: String(body.heist).slice(0, 40),
        payout: Number(body.payout) || 50000,
        timeSec: Number(body.timeSec) || 100,
      });
      if (EDGE_LEADERBOARD.length > 20) EDGE_LEADERBOARD.pop();
    }
    return new Response(JSON.stringify({ ok: true, leaderboard: EDGE_LEADERBOARD }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
