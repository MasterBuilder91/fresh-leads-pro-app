/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add this to tell Next.js where to find your components and lib files
  // if they're still in the src directory
  experimental: {
    appDir: true,
  }
};

module.exports = nextConfig;
