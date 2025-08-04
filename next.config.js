/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment configuration
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: false, // Enable image optimization for Vercel
  },
  optimizeFonts: true,
  // Remove static export config for Vercel
}

module.exports = nextConfig 