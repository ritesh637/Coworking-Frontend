// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/payment",
//         destination: "/payment/index.html",
//       },
//     ];
//   },
// };

// export default nextConfig;

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
  images: {
    domains: ["live.templately.com", "visionspaces.co", "images.unsplash.com"],
  },
};

export default nextConfig;
