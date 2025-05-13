import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // <-- 이 줄 추가
  },
  trailingSlash: true, // 필요에 따라
  eslint: {
    // 빌드 도중 ESLint 경고/에러가 있어도 무시
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
