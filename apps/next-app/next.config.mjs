/** @type {import('next').NextConfig} */
import withImages from "next-images";

export default withImages({
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
});
