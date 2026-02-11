import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack configuration for stability
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // Added to silence the Turbopack/Webpack conflict error in Next.js 16+
  turbopack: {},
};

export default nextConfig;
