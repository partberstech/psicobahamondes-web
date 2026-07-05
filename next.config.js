/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.psicobahamondes.cl'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
