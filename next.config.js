/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/admin.html', destination: '/admin' },
      { source: '/gold.html', destination: '/collections/gold' },
      { source: '/diamond.html', destination: '/collections/diamond' },
      { source: '/earrings.html', destination: '/collections/earrings' },
      { source: '/gemstone.html', destination: '/collections/gemstone' },
      { source: '/daily-wear.html', destination: '/collections/daily-wear' },
      { source: '/wedding.html', destination: '/collections/wedding' },
      { source: '/gifting.html', destination: '/collections/gifting' },
      { source: '/under-50k.html', destination: '/collections/under-50k' },
      { source: '/all-jewellery.html', destination: '/collections/all' },
    ];
  },
};

module.exports = nextConfig;
