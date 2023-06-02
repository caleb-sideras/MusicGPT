/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.genius.com', 'storage.googleapis.com'],
  },
  swcMinify: false,
  // webpack(config) {
  //   config.optimization.minimize = false;
  //   return config;
  // },
  // experimental: {
  //   swcMinify: false,
  // },
}

module.exports = nextConfig
