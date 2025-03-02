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
      'www.figma.com',
      'static.figma.com',
      // Add any other domains you might need
    ],
  },
  eslint: {
    dirs: ['app'],
  },
};

module.exports = nextConfig;
