/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    // Add your webpack configurations here if needed
    return config;
  },
};

module.exports = nextConfig; 