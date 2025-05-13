// components/shell.tsx
"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  BellIcon,
  DatabaseIcon,
  LaptopIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: "default" | "ghost";
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 반응형 감지
  useEffect(() => {
    setIsMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 모바일에서 링크 클릭 시 사이드바 닫기
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // 네비게이션 아이템 정의
  const mainNavItems: NavItem[] = [
    {
      title: "대시보드",
      href: "/",
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
      variant: pathname === "/" ? "default" : "ghost",
    },
    {
      title: "PC 목록",
      href: "/pc",
      icon: <LaptopIcon className="h-5 w-5" />,
      variant: pathname === "/pc" ? "default" : "ghost",
    },
    {
      title: "PC 등록",
      href: "/pc/create",
      icon: <PlusCircleIcon className="h-5 w-5" />,
      variant: pathname === "/pc/create" ? "default" : "ghost",
    },
  ];

  // 관리 메뉴 아이템
  const managementNavItems: NavItem[] = [
    {
      title: "보안 현황",
      href: "/security",
      icon: <ShieldIcon className="h-5 w-5" />,
      variant: pathname === "/security" ? "default" : "ghost",
    },
    {
      title: "데이터 백업",
      href: "/backup",
      icon: <DatabaseIcon className="h-5 w-5" />,
      variant: pathname === "/backup" ? "default" : "ghost",
    },
    {
      title: "분석 보고서",
      href: "/reports",
      icon: <BarChart3Icon className="h-5 w-5" />,
      variant: pathname === "/reports" ? "default" : "ghost",
    },
  ];

  // 사이드바 컨텐츠
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          onClick={handleLinkClick}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <LaptopIcon className="h-4 w-4 text-white" />
          </div>
          <span>Enterprise PC 관리</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <div className="flex flex-col gap-4 px-2">
          <div className="px-4 py-2">
            <div className="group flex items-center justify-between rounded-md border px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
              <SearchIcon className="h-4 w-4 opacity-50" />
              <Input
                type="search"
                placeholder="PC 또는 사용자 검색..."
                className="h-8 w-full border-0 bg-transparent p-0 pl-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
              />
            </div>
          </div>
          <div className="px-4">
            <h2 className="mb-2 text-xs font-semibold tracking-tight text-muted-foreground">
              주요 메뉴
            </h2>
            <div className="space-y-1">
              {mainNavItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.variant}
                  className={cn(
                    "w-full justify-start font-normal",
                    item.variant === "default" &&
                      "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20"
                  )}
                  asChild
                >
                  <Link href={item.href} onClick={handleLinkClick}>
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="px-4">
            <h2 className="mb-2 text-xs font-semibold tracking-tight text-muted-foreground">
              관리 메뉴
            </h2>
            <div className="space-y-1">
              {managementNavItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.variant}
                  className={cn(
                    "w-full justify-start font-normal",
                    item.variant === "default" &&
                      "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20"
                  )}
                  asChild
                >
                  <Link href={item.href} onClick={handleLinkClick}>
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                    {item.title === "보안 현황" && (
                      <Badge
                        variant="destructive"
                        className="ml-auto shrink-0 px-2 py-0 text-xs font-normal"
                      >
                        3
                      </Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* 모바일 네비게이션 */}
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <header className="sticky top-0 z-40 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-full items-center">
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2 shrink-0">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <div className="flex w-full items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                    <LaptopIcon className="h-4 w-4 text-white" />
                  </div>
                  <span>Enterprise PC 관리</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="사용자"
                          />
                          <AvatarFallback>관리자</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>프로필</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>설정</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ThemeToggle />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50">
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
          <main className="flex-1">
            <div className="container pt-4 pb-8">{children}</div>
          </main>
        </Sheet>
      ) : (
        // 데스크톱 레이아웃
        <div className="grid overflow-hidden lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-r lg:block">
            <SidebarContent />
          </aside>
          <div className="flex flex-col">
            <header className="sticky top-0 z-30 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-full items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="PC 또는 사용자 검색..."
                    className="w-full pl-10"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <Button variant="ghost" size="icon" className="relative">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      3
                    </span>
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="사용자"
                          />
                          <AvatarFallback>관리자</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-sm font-normal">
                          <p className="font-medium">관리자 계정</p>
                          <p className="text-xs text-muted-foreground">
                            admin@company.com
                          </p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>프로필</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>설정</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50">
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="container py-6">{children}</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
