/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next build` and `next dev` share one output directory, and a build wipes
  // .next/server and rewrites it with production chunk names. Run one while the
  // other is live and the dev server starts asking for chunks that no longer
  // exist — "Cannot find module './948.js'" — until it is restarted against a
  // clean .next. Setting NEXT_DIST_DIR gives a verification build somewhere
  // else to land, so it cannot disturb a running dev server:
  //
  //   NEXT_DIST_DIR=.next-verify npx next build
  //
  // Unset everywhere else, so `npm run dev`, `next build` and server.js on the
  // host all keep using .next exactly as before.
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // Shared cPanel hosting (CloudLinux LVE) caps processes/threads.
  // Cap build workers so `next build` fits within the limit.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },

  // Next serves /public with no-cache by default, so every repeat visit
  // re-fetches the hero. These filenames carry their own width and codec, so a
  // changed asset is always a new URL and a long immutable cache is safe.
  async headers() {
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    return [
      { source: '/hero/:file*', headers: immutable },
      { source: '/videos/:file*', headers: immutable },
    ];
  },
};

export default nextConfig;
