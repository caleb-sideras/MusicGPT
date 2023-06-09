/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.genius.com', 'storage.googleapis.com', 's3.amazonaws.com'],
  },
  swcMinify: false,
}

module.exports = nextConfig
