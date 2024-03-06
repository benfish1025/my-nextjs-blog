const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = {
  output: "export",
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
