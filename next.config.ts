import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// What the browser may load. Next.js puts small inline scripts in every page, so 'unsafe-inline'
// is needed for scripts while pages stay static; everything else is limited to this site, Sanity
// (photos and live content updates) and Google Maps (the map on the home page).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self'",
  `connect-src 'self' https://api.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io${isDev ? " ws:" : ""}`,
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Let phones on the same Wi-Fi use the dev server (e.g. http://10.10.101.239:3000).
  allowedDevOrigins: ["10.*.*.*", "172.*.*.*", "192.168.*.*"],
  images: {
    // Photos come from Sanity's image CDN, which resizes them itself.
    loader: "custom",
    loaderFile: "./src/sanity/image-loader.ts",
    // No 3840px version: uploaded photos are rarely that large, and it only costs phones data.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
