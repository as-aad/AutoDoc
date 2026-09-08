/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ── Performance: enable image optimization (WebP conversion, responsive sizes)
  images: {
    domains: ['images.unsplash.com', 'bolt.new'],
    formats: ['image/webp', 'image/avif'],
  },
  // ── Performance: enable gzip/brotli compression
  compress: true,
  // ── Performance: use SWC minifier for faster builds & smaller bundles
  swcMinify: true,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/public/uploads/**',
        ],
      };
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

