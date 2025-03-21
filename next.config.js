/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@headlessui/react'],
  },
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig; 