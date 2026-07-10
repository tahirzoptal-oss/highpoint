/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site output (out/), same cheap/crawlable hosting model as v1.
  output: "export",
  // Required for static export: no image-optimization server.
  images: {
    unoptimized: true,
  },
  // Type + lint gates enforced: a per-client build must be type-clean to ship.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
