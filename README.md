# GTA V: Los Santos 3D Web Edition (Astro + Cloudflare Workers)

A complete, browser-playable 3D open-world game inspired by **Grand Theft Auto V**, built using the **Astro** framework and **Three.js** for **Cloudflare Workers** (`@astrojs/cloudflare` with Static Assets in `public/` — **Zero D1 and Zero R2 dependencies**).

## Architecture & Pure 3D Assets (`public/`)

All 3D binary glTF 2.0 (`.glb`) models and procedural textures live directly inside `public/models/` and `public/textures/` so Cloudflare Workers serves them via edge static assets without R2 or D1:

- `public/models/character_michael.glb` — Michael De Santa 3D humanoid mesh
- `public/models/character_franklin.glb` — Franklin Clinton 3D humanoid mesh
- `public/models/character_trevor.glb` — Trevor Philips 3D humanoid mesh
- `public/models/vehicle_sportscar.glb` — Zentorno / Infernus Supercar 3D mesh
- `public/models/vehicle_muscle.glb` — Sabre Turbo Muscle Car 3D mesh
- `public/models/vehicle_police.glb` — LSPD Police Cruiser 3D mesh
- `public/models/vehicle_helicopter.glb` — Buzzard Attack Helicopter 3D mesh
- `public/models/vehicle_motorcycle.glb` — PCJ-600 Street Motorcycle 3D mesh
- `public/models/weapon_pack.glb` — 3D Firearms & RPG mesh kit
- `public/models/city_landmarks.glb` — Los Santos Palm & Landmark 3D mesh kit
- `public/textures/los_santos_hero.jpg` — Los Santos Sunset Cover Artwork
- `public/textures/road_asphalt.png` — Procedural Asphalt Road Texture
- `public/textures/building_facade.png` — Procedural Skyscraper Window Facade Texture
- `public/textures/terrain_grass.png` — Procedural Vinewood & Park Terrain Texture

## Complete GTA 5 Feature Set

1. **Three Playable Protagonists & Sky-Cam Switching (`1`, `2`, `3` or Character Wheel)**:
   - **Michael De Santa**: Special Ability (`Q` / HUD button) — **Bullet Time** slows combat time and boosts weapon damage.
   - **Franklin Clinton**: Special Ability (`Q` / HUD button) — **Driving Slow-Mo** slows time for high-speed cornering and traffic weaving.
   - **Trevor Philips**: Special Ability (`Q` / HUD button) — **Red Mist Rage** deals 2.5x damage and reduces incoming damage by 65%.
   - **Satellite Sky-Cam Switch**: 3-stage top-down cloud zoom-out, pan across Los Santos to the target protagonist, and 3-stage zoom-in.
2. **Los Santos & Blaine County 3D Open World**:
   - **Downtown Los Santos**: Maze Bank Tower, FIB Tower, glass skyscrapers, intersections, street lights.
   - **Vinewood Hills**: Hillside **VINEWOOD** landmark sign, winding boulevards, palm trees.
   - **Vespucci Beach & Del Perro Pier**: Sandy shoreline, ocean water, boardwalk, and animated Ferris wheel.
   - **Sandy Shores Airfield**: Desert terrain, runway, Buzzard helicopter pad, and Trevor's outpost.
   - **Los Santos Customs & Ammu-Nation**: Drive into LS Customs to repair, respray, add neon underglow, or upgrade engine/armor; visit Ammu-Nation to buy weapons and body armor.
3. **Vehicles, Helicopter Flight & Traffic AI**:
   - Hijack or enter any vehicle (`F` or on-screen button): Supercar, Muscle Car, SUV, LSPD Police Cruiser (with working sirens `E`), PCJ-600 Motorcycle, and **Buzzard Attack Helicopter** (`Space` ascend, `Shift` descend, `WASD` pitch/yaw).
4. **8-Slot Weapon Wheel, Explosions & 5-Star Wanted System**:
   - Switch between Fists, Combat Pistol, Micro SMG, Carbine Rifle, Pump Shotgun, Heavy Sniper, RPG Rocket Launcher, and Sticky Grenades (`Tab` or Weapon Wheel).
   - 1–5 Star LSPD Pursuit AI with police cruisers, sirens, aerial spotlight helicopters at 3+ stars, line-of-sight evasion cooldown, and Wasted / Busted hospital/station respawn.
5. **Story Missions, Heists, iFruit Smartphone (`P`) & Radio Wheel (`R`)**:
   - 5 replayable Missions & Multi-Stage Heists (including the *Vangelico Jewelry Heist* and *Union Depository Gold Heist*).
   - iFruit Smartphone with Missions App, Maze Bank, BAWSAQ Stock Market, Cheat Codes (`PAINKILLER`, `LAWYERUP`, `COMET`, `BUZZOFF`, `TURTLE`, `TOOLUP`), and Low-End Device Graphics Optimizer (**Potato / Ultra-Low Mode**, **Balanced**, **High**).
   - WebAudio Synthesizer Radio Stations (*Los Santos Rock Radio*, *Non-Stop-Pop FM*, *Radio Los Santos*, *West Coast Classics*, *FlyLo FM*).

## Quick Start & Cloudflare Workers Deployment

```bash
# 1. Install dependencies
npm install

# 2. Start local Astro + Cloudflare dev server
npm run dev

# 3. Build production bundle (outputs static assets + _worker.js to ./dist)
npm run build

# 4. Deploy to Cloudflare Workers (uses wrangler.jsonc, no D1 or R2 needed)
npx wrangler deploy
```

### Static-asset upload: what actually gets deployed

`wrangler.jsonc` points `assets.directory` at `./dist` and `main` at
`./dist/_worker.js/index.js`. Wrangler deliberately ignores almost nothing by
default, so without an ignore list **every file in `./dist` — including the
server-side Worker bundle — would be published as a public static asset.**

`public/.assetsignore` (copied to `dist/.assetsignore` on every build) is a
`.gitignore`-style list that keeps the upload limited to the real client files
(`index.html`, `models/**`, `textures/**`). It excludes `_worker.js`,
`_routes.json`, the ignore file itself, and any dev/secret leftovers, so the
Worker script is never downloadable as a static file.

Two repo-level files round this out:

- **`.gitignore`** — keeps `node_modules/`, `.wrangler/`, `.dev.vars*`,
  `.env*`, editor/OS junk and logs out of version control. `dist/` is
  intentionally *not* ignored, so the prebuilt Worker can be deployed straight
  from a fresh clone with no build step. Uncomment the `dist/` line if you
  would rather build on every deploy.
- **`.gitattributes`** — forces LF line endings, marks `.glb` / `.png` / `.jpg`
  as binary, and collapses the generated `dist/**` output in diffs.

To check exactly which files will be uploaded before deploying:

```bash
npx wrangler deploy --dry-run
```
