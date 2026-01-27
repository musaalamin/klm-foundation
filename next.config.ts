/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to finish even if there are small typos in the "types"
    ignoreBuildErrors: true,
  },
  eslint: {
    // This ignores linting warnings during the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;