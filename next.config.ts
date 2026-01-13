import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Auth support just in case
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com", // YouTube
      },
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net", // Twitch
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com", // Twitter
      },
      {
        protocol: "https",
        hostname: "i.imgur.com", // Imgur
      },
    ],
  },
};

export default nextConfig;
