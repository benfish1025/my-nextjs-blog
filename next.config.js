const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = {
  output: "export",
  reactStrictMode: true,
  assetPrefix: 'https://benfish1025.github.io/my-nextjs-blog/',
  basePath: "/my-nextjs-blog",
  images: {
    unoptimized: true,
  },
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },
}
