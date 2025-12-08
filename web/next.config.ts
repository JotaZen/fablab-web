import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone para Docker
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },



  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Strapi CMS
        protocol: "https",
        hostname: "**.tudominio.com",
        pathname: "/**",
      },
      {
        // Strapi local
        protocol: "http",
        hostname: "localhost",
        port: "9010",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

