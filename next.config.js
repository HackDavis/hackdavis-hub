/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.usertesting.com',
      'uxdesign.cc',
      'www.designkit.org',
      'www.youtube.com',
      'youtube.com',
      'img.youtube.com',
      'i.ytimg.com',
      'youtu.be',
      'www.figma.com',
      'static.figma.com',
      'ideo.com',
      'www.ideo.com',
      'images.ctfassets.net', // Common CDN for content
      'cdn.sanity.io', // Common CDN for content
      'res.cloudinary.com', // Common CDN for content
      // Add any other domains you might need
    ],
  },
  eslint: {
    dirs: ['app'],
  },
};

module.exports = nextConfig;
