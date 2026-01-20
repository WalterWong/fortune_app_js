import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/fortune_app_js" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
