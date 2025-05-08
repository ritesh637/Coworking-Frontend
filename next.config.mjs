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
    domains: [
      "live.templately.com",
      "visionspaces.co",
      "images.unsplash.com",
      "t3.ftcdn.net",
      "cdn.pixabay.com",
      "media.istockphoto.com",
      "your-other-domain.com",
      "s3.ap-south-1.amazonaws.com",
      "www.603thecoworkingspace.com",
    ],
  },
};

export default nextConfig;
