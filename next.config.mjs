/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shared cPanel hosting (CloudLinux LVE) caps processes/threads.
  // Cap build workers so `next build` fits within the limit.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
