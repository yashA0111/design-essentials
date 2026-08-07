import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_IP ? [process.env.DEV_IP] : [],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  serverExternalPackages: ["esbuild"],

  turbopack: {
    root: fs.realpathSync.native(path.resolve(__dirname)),
  },
};

export default nextConfig;