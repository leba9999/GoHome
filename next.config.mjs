import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-pwa uses webpack; opt out of Turbopack for builds
  turbopack: {},
}

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Disable service worker in development to avoid caching issues
  disable: process.env.NODE_ENV === "development",
})(nextConfig)
