import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_IP 
    ? [process.env.DEV_IP] 
    : [],
    
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  
  serverExternalPackages: ["esbuild"]
};

export default nextConfig;