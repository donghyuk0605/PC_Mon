// pages/_app.tsx
import Sidebar from "@/components/ui/sidebar";
import type { AppProps } from "next/app";

import "./styles/globals.css"; // 꼭 있어야 Tailwind가 적용됨
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 사이드바 고정 */}
      <Sidebar />

      {/* 메인 영역 */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
