// src/components/Sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "lib/firebase";
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
import React, { useEffect, useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

export const Sidebar: React.FC = React.memo(() => {
  const pathname = usePathname().replace(/\/$/, "");
  const [collapsed, setCollapsed] = useState(false);

  // Firestore 컬렉션 카운트를 실시간으로 가져와 badge 에 사용
  const [pcCount, setPcCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);
  const [patchCount, setPatchCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // PCS
    const unsubPcs = onSnapshot(
      collection(db, "pcs"),
      (snap) => setPcCount(snap.size),
      (err) => console.error("PC count error", err)
    );
    // Vulnerabilities
    const unsubVulns = onSnapshot(
      collection(db, "vulnerabilities"),
      (snap) => setVulnCount(snap.size),
      (err) => console.error("Vuln count error", err)
    );
    // Patches
    const unsubPatches = onSnapshot(
      collection(db, "patches"),
      (snap) => setPatchCount(snap.size),
      (err) => console.error("Patch count error", err)
    );
    // Users
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => setUserCount(snap.size),
      (err) => console.error("User count error", err)
    );

    return () => {
      unsubPcs();
      unsubVulns();
      unsubPatches();
      unsubUsers();
    };
  }, []);

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
          badge: pcCount,
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
          badge: vulnCount,
        },
        {
          label: "パッチ管理",
          href: "/security/patches",
          icon: <Terminal className="w-4 h-4" />,
          badge: patchCount,
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
          badge: userCount,
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

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <nav
      className={`flex flex-col h-full ${
        collapsed ? "w-20" : "w-64"
      } bg-gray-900 border-r border-gray-800 transition-all duration-300`}
    >
      {/* ロゴ & トグル */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="PCMon" width={24} height={24} />
            <span className="text-xl font-bold text-white">PCMon</span>
          </div>
        ) : (
          <Image
            src="/favicon.png"
            alt="icon"
            width={24}
            height={24}
            className="mx-auto"
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded"
        >
          {collapsed ? (
            <List className="w-5 h-5" />
          ) : (
            <LayoutDashboard className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* メニュー */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {SECTIONS.map((sec) => {
            const isActiveSection = sec.items.some(
              (it) => it.href === pathname
            );
            const isOpen = openSections[sec.title] ?? isActiveSection;

            return (
              <li key={sec.title}>
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleSection(sec.title)}
                >
                  <CollapsibleTrigger
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors duration-150 ${
                      isActiveSection ? "bg-gray-800" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-800 rounded-md text-blue-400">
                        {sec.icon}
                      </div>
                      {!collapsed && (
                        <span className="font-semibold text-sm">
                          {sec.title}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
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
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent
                    className={`mt-1 mb-2 space-y-1 pl-9 ${
                      collapsed ? "hidden" : ""
                    }`}
                  >
                    {sec.items.map((it) => {
                      const active = pathname === it.href;
                      return (
                        <Link
                          key={it.href}
                          href={it.href}
                          prefetch={false}
                          className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors duration-150 ${
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
                          {it.badge != null && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white">
                              {it.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 로그아웃 */}
      <div
        className={`px-4 py-4 border-t border-gray-800 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <Button
          variant="ghost"
          className={`w-full justify-start text-red-400 hover:bg-red-700 hover:text-white ${
            collapsed ? "p-2 justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {!collapsed && "ログアウト"}
        </Button>
      </div>
    </nav>
  );
});

export default Sidebar;
