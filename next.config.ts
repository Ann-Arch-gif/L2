import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Branded 404 page for URLs that match nothing (see src/app/global-not-found.tsx).
    globalNotFound: true,
  },
};

export default nextConfig;
