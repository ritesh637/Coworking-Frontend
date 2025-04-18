/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/payment",
        destination: "/payment/index.html",
      },
    ];
  },
};

export default nextConfig;
