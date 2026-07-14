import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (≈20–30% smaller than WebP), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Cache optimized images at the edge for 31 days.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
