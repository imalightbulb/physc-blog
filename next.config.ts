import type { NextConfig } from 'next';

// Set STATIC_EXPORT=true when building for GitHub Pages
const isStatic = process.env.STATIC_EXPORT === 'true';
const basePath = process.env.BASE_PATH || '';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (enabled via STATIC_EXPORT=true)
  ...(isStatic && { output: 'export' }),

  // basePath for GitHub Pages project pages (e.g. /phy-blog)
  basePath,
  trailingSlash: true,

  // Expose basePath to client components for resolving static asset paths
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    // next/image optimization requires a server; disable for static export
    unoptimized: isStatic,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    localPatterns: [
      { pathname: '/uploads/**' },
    ],
  },

  // Allow importing better-sqlite3 (native module) on the server
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
