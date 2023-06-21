/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  reactStrictMode: true,
  images: {
    domains: ['images.genius.com', 'storage.googleapis.com', 's3.amazonaws.com', 'gravatar.com', 'img.clerk.com'],
  },
  swcMinify: false,
}

module.exports = nextConfig
