/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.DATABASE_DOMAIN_NAME!],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["buffer"],
  },
};

export default nextConfig;
