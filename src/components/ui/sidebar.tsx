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
  Activity,
  AlertTriangle,
  ChevronRight,
  Circle,
  ExternalLink,
  FileText,
  HardDrive,
  Home,
  LogOut,
  Monitor,
  Package,
  Plus,
  Server,
  Settings,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
  status?: "critical" | "warning" | "success" | "info" | "default";
  isNew?: boolean;
  isExperimental?: boolean;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  description?: string;
}

export const Sidebar: React.FC = React.memo(() => {
  const pathname = usePathname().replace(/\/$/, "");
  const [pcCount, setPcCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);
  const [patchCount, setPatchCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [onlinePCs, setOnlinePCs] = useState(0);
  const [criticalIssues, setCriticalIssues] = useState(0);

  useEffect(() => {
    const unsubPcs = onSnapshot(
      collection(db, "pcs"),
      (snap) => {
        setPcCount(snap.size);
        const online = snap.docs.filter(
          (doc) => doc.data().status === "online"
        ).length;
        setOnlinePCs(online);
      },
      (err) => console.error("PC count error", err)
    );
    const unsubVulns = onSnapshot(
      collection(db, "vulnerabilities"),
      (snap) => {
        setVulnCount(snap.size);
        const critical = snap.docs.filter(
          (doc) => doc.data().severity === "critical"
        ).length;
        setCriticalIssues(critical);
      },
      (err) => console.error("Vuln count error", err)
    );
    const unsubPatches = onSnapshot(
      collection(db, "patches"),
      (snap) => setPatchCount(snap.size),
      (err) => console.error("Patch count error", err)
    );
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
      icon: <Home className="w-4 h-4" />,
      description: "システム全体の概要",
      items: [
        {
          label: "システム概要",
          href: "/",
          icon: <Activity className="w-4 h-4" />,
          status: criticalIssues > 0 ? "critical" : "success",
        },
      ],
    },
    {
      title: "資産管理",
      icon: <Server className="w-4 h-4" />,
      description: "デバイスとリソース",
      items: [
        {
          label: "PCインベントリ",
          href: "/pc",
          icon: <Monitor className="w-4 h-4" />,
          badge: `${onlinePCs}/${pcCount}`,
          status: onlinePCs < pcCount * 0.8 ? "warning" : "success",
        },
        {
          label: "資産登録",
          href: "/pc/create",
          icon: <Plus className="w-4 h-4" />,
          isNew: true,
        },
        {
          label: "ハードウェア管理",
          href: "/pc/hardware",
          icon: <HardDrive className="w-4 h-4" />,
        },
        {
          label: "ソフトウェア管理",
          href: "/pc/software",
          icon: <Package className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "セキュリティ管理",
      icon: <Shield className="w-4 h-4" />,
      description: "脅威と脆弱性の監視",
      items: [
        {
          label: "セキュリティ状況",
          href: "/security/status",
          icon: <Shield className="w-4 h-4" />,
          badge: criticalIssues > 0 ? criticalIssues : undefined,
          status: criticalIssues > 0 ? "critical" : "success",
        },
        {
          label: "脆弱性分析",
          href: "/security/vulnerabilities",
          icon: <AlertTriangle className="w-4 h-4" />,
          badge: vulnCount,
          status:
            vulnCount > 10 ? "warning" : vulnCount > 0 ? "info" : "success",
        },
        {
          label: "パッチ管理",
          href: "/security/patches",
          icon: <Terminal className="w-4 h-4" />,
          badge: patchCount,
          status: patchCount > 5 ? "warning" : "info",
        },
      ],
    },
    {
      title: "ユーザー管理",
      icon: <Users className="w-4 h-4" />,
      description: "アクセスと権限",
      items: [
        {
          label: "ユーザー一覧",
          href: "/users/list",
          icon: <Users className="w-4 h-4" />,
          badge: userCount,
          status: "default",
        },
        {
          label: "権限設定",
          href: "/users/permissions",
          icon: <FileText className="w-4 h-4" />,
          isExperimental: true,
        },
      ],
    },
    {
      title: "レポート",
      icon: <FileText className="w-4 h-4" />,
      items: [],
    },
    {
      title: "システム設定",
      icon: <Settings className="w-4 h-4" />,
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

  const getBadgeStyle = (status?: string) => {
    switch (status) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case "critical":
        return <Circle className="w-2 h-2 fill-red-500 text-red-500" />;
      case "warning":
        return <Circle className="w-2 h-2 fill-amber-500 text-amber-500" />;
      case "success":
        return <Circle className="w-2 h-2 fill-green-500 text-green-500" />;
      case "info":
        return <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <nav className="flex flex-col h-full w-72 bg-slate-800 border-r border-slate-700">
      {/* ヘッダー */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-3 h-16 px-6">
          <div className="relative">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg shadow-lg">
              <Server className="w-5 h-5 text-white" />
            </div>
            {criticalIssues > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">PCMon</h1>
            <p className="text-xs text-slate-400">開発バージョンv0.1</p>
          </div>
        </div>

        {/* クイックステータス */}
        <div className="px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span className="text-slate-300">システム稼働中</span>
          </div>
          <span className="text-slate-500">最終更新: 5分前</span>
        </div>
      </div>

      {/* メニューコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-1">
          {SECTIONS.map((section) => {
            const isActiveSection = section.items.some(
              (item) => item.href === pathname
            );
            const isOpen = openSections[section.title] ?? isActiveSection;

            return (
              <li key={section.title}>
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleSection(section.title)}
                >
                  <CollapsibleTrigger
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActiveSection
                        ? "text-white bg-slate-700/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-md ${
                          isActiveSection
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {section.icon}
                      </div>
                      <div className="text-left">
                        <span className="block">{section.title}</span>
                        {section.description && (
                          <span className="text-xs text-slate-500 font-normal">
                            {section.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {section.items.length > 0 && (
                      <ChevronRight
                        className={`w-4 h-4 text-slate-500 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <ul className="mt-1 space-y-0.5 ml-3">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`flex items-center justify-between pl-11 pr-3 py-2 rounded-md text-sm transition-all group ${
                                isActive
                                  ? "text-white bg-blue-600/20 border-l-2 border-blue-500"
                                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {item.icon}
                                  {item.status && (
                                    <div className="absolute -bottom-1 -right-1">
                                      {getStatusIndicator(item.status)}
                                    </div>
                                  )}
                                </div>
                                <span className="flex items-center gap-2">
                                  {item.label}
                                  {item.isNew && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">
                                      NEW
                                    </span>
                                  )}
                                  {item.isExperimental && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-400 rounded">
                                      BETA
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.badge != null && (
                                  <span
                                    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getBadgeStyle(
                                      item.status
                                    )}`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                {isActive && (
                                  <ExternalLink className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            );
          })}
        </ul>
      </div>

      {/* フッター */}
      <div className="border-t border-slate-700 bg-slate-900">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-lg bg-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">管理者</p>
              <p className="text-xs text-slate-400">admin@pcmon.local</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </div>
    </nav>
  );
});

export default Sidebar;
