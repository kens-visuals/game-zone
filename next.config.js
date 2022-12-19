/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    RAWG_API_KEY: process.env.RAWG_API_KEY,
  },
};

module.exports = nextConfig;
