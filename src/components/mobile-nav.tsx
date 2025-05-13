// components/mobile-nav.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Laptop,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="px-2 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* 사이드바 */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-lg">PC 관리 시스템</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-col gap-1 p-3">
              <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1 px-3 mt-2">
                주요 메뉴1
              </p>

              <Link
                href="/"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                대시보드
              </Link>

              <Link
                href="/pc"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Laptop className="h-4 w-4" />
                PC 목록
              </Link>

              <Link
                href="/pc/create"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                <PlusCircle className="h-4 w-4" />
                PC 등록
              </Link>
            </nav>

            <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
