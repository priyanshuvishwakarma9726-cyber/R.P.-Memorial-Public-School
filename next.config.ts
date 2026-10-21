import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Guarantees local and static images work smoothly in all environments
  },
};

export default nextConfig;
