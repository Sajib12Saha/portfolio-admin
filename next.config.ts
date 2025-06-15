import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.DATABASE_DOMAIN_NAME!],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
