/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["img.clerk.com", "i.ibb.co", "i.imgur.com", "picsum.photos"],
  },

  async rewrites() {
    return [
      {
        source: '/api/python/:path*',
        destination: 'http://127.0.0.1:5328/api/python/:path*',
      },
    ];
  },
};

export default nextConfig;