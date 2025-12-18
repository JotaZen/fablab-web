import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  // Output standalone para Docker
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración experimental para Payload
  experimental: {
    reactCompiler: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Payload CMS Media - localhost development
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/media/**",
      },
      {
        // Producción
        protocol: "https",
        hostname: "**.tudominio.com",
        pathname: "/**",
      },
    ],
  },
};

export default withPayload(nextConfig);
