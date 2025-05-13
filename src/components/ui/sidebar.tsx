"use client";

import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  Cpu,
  FileText,
  HardDrive,
  LayoutDashboard,
  List,
  LogOut,
  PlusCircle,
  Server,
  Settings,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const SECTIONS: Section[] = [
  {
    title: "ダッシュボード",
    icon: <LayoutDashboard className="w-5 h-5" />,
    items: [
      {
        label: "システム概要",
        href: "/",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "資産管理",
    icon: <Cpu className="w-5 h-5" />,
    items: [
      {
        label: "PCインベントリ",
        href: "/pc",
        icon: <List className="w-4 h-4" />,
      },
      {
        label: "資産登録",
        href: "/pc/create",
        icon: <PlusCircle className="w-4 h-4" />,
      },
      {
        label: "ハードウェア管理",
        href: "/pc/hardware",
        icon: <HardDrive className="w-4 h-4" />,
      },
      {
        label: "ソフトウェア管理",
        href: "/pc/software",
        icon: <Server className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "セキュリティ管理",
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        label: "セキュリティ状況",
        href: "/security/status",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        label: "脆弱性分析",
        href: "/security/vulnerabilities",
        icon: <AlertTriangle className="w-4 h-4" />,
        badge: 3,
      },
      {
        label: "パッチ管理",
        href: "/security/patches",
        icon: <Terminal className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "ユーザー管理",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        label: "ユーザー一覧",
        href: "/users/list",
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: "権限設定",
        href: "/users/permissions",
        icon: <FileText className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "レポート",
    icon: <FileText className="w-5 h-5" />,
    items: [],
  },
  {
    title: "システム",
    icon: <Settings className="w-5 h-5" />,
    items: [],
  },
];

function SidebarContent() {
  const pathname = usePathname().replace(/\/$/, "");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <ul className="space-y-1">
      {SECTIONS.map((sec) => {
        const isActive = sec.items.some((it) => it.href === pathname);
        const isCollapsed = collapsed[sec.title] ?? !isActive;

        return (
          <Collapsible
            key={sec.title}
            open={!isCollapsed}
            onOpenChange={() => toggleSection(sec.title)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-150">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-800 rounded-md text-blue-400">
                  {sec.icon}
                </div>
                <span className="font-semibold text-sm">{sec.title}</span>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 transition-transform data-[state=open]:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-1 mb-2 space-y-1 pl-9">
              {sec.items.map((it) => {
                const active = pathname === it.href;

                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      prefetch={false}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors duration-150
                        ${
                          active
                            ? "bg-blue-600 text-white border-l-4 border-blue-400"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1 rounded ${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {it.icon}
                        </div>
                        {it.label}
                      </div>

                      {it.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            typeof it.badge === "number"
                              ? "bg-red-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {it.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </ul>
  );
}

export const Sidebar = /*#__PURE__*/ React.memo(function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`flex flex-col h-full ${
        collapsed ? "w-20" : "w-64"
      } bg-gray-900 dark:bg-gray-900 border-r border-gray-800 transition-all duration-300`}
    >
      <div className="flex items-center h-16 px-6 border-b border-gray-800 justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="PCMon ロゴ"
              width={24}
              height={24}
              priority
            />
            <span className="text-xl font-bold text-white">PCMon</span>
          </div>
        ) : (
          <Image
            src="/favicon.png"
            alt="PCMon アイコン"
            className="h-6 mx-auto"
          />
        )}
        {collapsed && (
          <span className="text-xl font-bold text-white mx-auto">🖥</span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded"
        >
          {collapsed ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 6L5 12L11 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {!collapsed ? (
          <SidebarContent />
        ) : (
          <div className="px-2 space-y-4">
            {SECTIONS.map((sec) => (
              <div key={sec.title} className="flex flex-col items-center">
                <div
                  className="p-2 bg-gray-800 rounded-md text-blue-400 hover:bg-gray-700 transition-colors cursor-pointer"
                  title={sec.title}
                >
                  {sec.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`px-4 py-4 border-t border-gray-800 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        {!collapsed ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-700 hover:text-white transition-colors duration-150"
          >
            <LogOut className="w-5 h-5 mr-2" />
            ログアウト
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="p-2 text-red-400 hover:bg-red-700 hover:text-white transition-colors duration-150"
            title="ログアウト"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </nav>
  );
});
