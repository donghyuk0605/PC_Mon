import { Sidebar } from "@/components/ui/sidebar"; // 메뉴 컴포넌트
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import jaCommon from "../locales/ja/common.json";
import koCommon from "../locales/ko/common.json";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";
  const messages = { common: locale === "ja" ? jaCommon : koCommon };

  return (
    <html lang={locale}>
      <body className="flex h-screen overflow-hidden">
        {/* ← 여기에 사이드바 메뉴 포함 */}
        <Sidebar />

        <main className="flex-1 overflow-auto bg-gray-50">
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
