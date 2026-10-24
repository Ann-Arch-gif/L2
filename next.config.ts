import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos come from Sanity's image CDN, which resizes them itself.
    loader: "custom",
    loaderFile: "./src/sanity/image-loader.ts",
  },
  async redirects() {
    return [
      // The admin (Sanity Studio) is hosted by Sanity.
      { source: "/admin", destination: "https://l2angkor.sanity.studio", permanent: false },
      { source: "/admin/:path*", destination: "https://l2angkor.sanity.studio/:path*", permanent: false },
    ];
  },
  experimental: {
    // Branded 404 page for URLs that match nothing (see src/app/global-not-found.tsx).
    globalNotFound: true,
  },
};

export default nextConfig;
