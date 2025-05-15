/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = {
      type: "filesystem",
    };
    return config;
  },
};

module.exports = nextConfig;
