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
  // eslint: {
  //   dirs: ['app', 'components', 'types', 'styles'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  // },
}

module.exports = nextConfig
