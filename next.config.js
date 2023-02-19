/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    API_KEY_EDITOR: process.env.API_KEY_EDITOR,
    ROOT_NODE_API: process.env.ROOT_NODE_API,
  },
};

module.exports = nextConfig;
