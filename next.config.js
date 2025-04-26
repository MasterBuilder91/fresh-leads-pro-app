/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove the appDir option as it's no longer needed in Next.js 14+
  experimental: {}
};

module.exports = nextConfig;
