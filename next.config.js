/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'placehold.jp',
        },
        {
          protocol: 'https',
          hostname: 'images.microcms-assets.io',
        },
        {
          protocol: 'https',
          hostname: 'bprdaqbqfkyulxlauone.supabase.co', // 追加
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  