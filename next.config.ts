import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // GSAP timelines and text splitting mutate the DOM once; a double effect run corrupts them.
  reactStrictMode: false,
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
