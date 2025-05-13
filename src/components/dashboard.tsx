"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import {
  Activity,
  AlertTriangle,
  Check,
  Cpu,
  Edit,
  HardDrive,
  Info,
  LayoutDashboard,
  LineChart,
  PlusCircle,
  RefreshCw,
  Server,
  Settings,
  ShieldAlert,
  Smartphone,
  Trash,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PcItem = {
  id: number;
  name: string;
  status: "online" | "offline" | "maintenance";
  ip?: string;
  lastSeen?: string;
  owner?: string;
  type?: string;
  os?: string;
  cpu?: string;
  ram?: string;
  usageRate?: number;
};

type Stats = {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
};

const initialStats = {
  total: 0,
  online: 0,
  offline: 0,
  maintenance: 0,
};

export function DashboardClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [pcs, setPcs] = useState<PcItem[]>([]);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [lastUpdated, setLastUpdated] = useState("");

  // 時間帯別使用量（例）
  const [hourlyUsage] = useState([
    { time: "00:00", usage: 12 },
    { time: "04:00", usage: 8 },
    { time: "08:00", usage: 25 },
    { time: "12:00", usage: 35 },
    { time: "16:00", usage: 42 },
    { time: "20:00", usage: 30 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          const mockPcs: PcItem[] = [
            {
              id: 1,
              name: "開発-PC-001",
              status: "online",
              ip: "192.168.1.101",
              lastSeen: "2分前",
              owner: "金開発",
              type: "デスクトップ",
              os: "Windows 11 Pro",
              cpu: "Intel i7-12700K",
              ram: "32GB",
              usageRate: 78,
            },
            {
              id: 2,
              name: "デザイン-PC-002",
              status: "offline",
              ip: "192.168.1.102",
              lastSeen: "3日前",
              owner: "李デザイン",
              type: "ワークステーション",
              os: "macOS Sonoma",
              cpu: "Apple M2 Pro",
              ram: "64GB",
              usageRate: 0,
            },
            {
              id: 3,
              name: "マーケティング-PC-003",
              status: "online",
              ip: "192.168.1.103",
              lastSeen: "たった今",
              owner: "朴マーケティング",
              type: "ノートPC",
              os: "Windows 11 Home",
              cpu: "AMD Ryzen 7",
              ram: "16GB",
              usageRate: 45,
            },
            {
              id: 4,
              name: "人事-PC-004",
              status: "maintenance",
              ip: "192.168.1.104",
              lastSeen: "1週間前",
              owner: "崔人事",
              type: "デスクトップ",
              os: "Ubuntu 24.04 LTS",
              cpu: "Intel i5-11600",
              ram: "16GB",
              usageRate: 0,
            },
            {
              id: 5,
              name: "財務-PC-005",
              status: "online",
              ip: "192.168.1.105",
              lastSeen: "30分前",
              owner: "鄭財務",
              type: "デスクトップ",
              os: "Windows 11 Pro",
              cpu: "Intel i7-13700",
              ram: "32GB",
              usageRate: 62,
            },
          ];

          setPcs(mockPcs);
          setStats({
            total: mockPcs.length,
            online: mockPcs.filter((pc) => pc.status === "online").length,
            offline: mockPcs.filter((pc) => pc.status === "offline").length,
            maintenance: mockPcs.filter((pc) => pc.status === "maintenance")
              .length,
          });
          setLastUpdated(new Date().toLocaleString("ja-JP"));
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        toast.error("データ読み込み失敗");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setLastUpdated(new Date().toLocaleString("ja-JP"));
          setIsLoading(false);
          resolve(true);
        }, 800);
      }),
      {
        loading: "データを更新中...",
        success: "データが更新されました",
        error: "データの読み込みに失敗しました",
      }
    );
  };

  // 状態バッジ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1 font-normal py-1">
            <Wifi className="h-3 w-3" /> オンライン
          </Badge>
        );
      case "offline":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1 font-normal py-1">
            <WifiOff className="h-3 w-3" /> オフライン
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1 font-normal py-1">
            <Wrench className="h-3 w-3" /> メンテナンス中
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 使用率バー色
  const getUsageRateColor = (rate: number) => {
    if (rate === 0) return "bg-gray-200";
    if (rate < 50) return "bg-green-500";
    if (rate < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  // 統計カード色
  const getStatColor = (title: string) => {
    switch (title) {
      case "全PC":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "オンラインPC":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "オフラインPC":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "メンテナンス中PC":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            システムダッシュボード
          </h1>
          <p className="text-gray-500 mt-1">
            PC管理システムの全体状況とリアルタイムステータスを確認できます。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="border-gray-200 text-gray-700"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            更新
          </Button>
          <Link href="/pc/create">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              PC登録
            </Button>
          </Link>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "全PC",
            value: stats.total,
            icon: <Server className="h-5 w-5" />,
            description: "登録済みPC総数",
          },
          {
            title: "オンラインPC",
            value: stats.online,
            icon: <Cpu className="h-5 w-5" />,
            description: "現在接続中のPC",
            percentage: stats.total
              ? Math.round((stats.online / stats.total) * 100)
              : 0,
          },
          {
            title: "オフラインPC",
            value: stats.offline,
            icon: <AlertTriangle className="h-5 w-5" />,
            description: "接続が切れたPC",
            percentage: stats.total
              ? Math.round((stats.offline / stats.total) * 100)
              : 0,
          },
          {
            title: "メンテナンス中PC",
            value: stats.maintenance,
            icon: <Wrench className="h-5 w-5" />,
            description: "現在メンテナンス中のPC",
            percentage: stats.total
              ? Math.round((stats.maintenance / stats.total) * 100)
              : 0,
          },
        ].map((stat) => (
          <Card key={stat.title} className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${getStatColor(stat.title)}`}>
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {stat.description}
                  </div>

                  {stat.percentage !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          stat.title === "オンラインPC"
                            ? "bg-green-500"
                            : stat.title === "オフラインPC"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* チャート & システム状態 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 時間帯別使用量チャート */}
        <Card className="border border-gray-200 shadow-sm md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">
                  時間帯別システム使用量
                </CardTitle>
                <CardDescription>本日の時間帯別PC使用状況</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-gray-200">
                <LineChart className="h-4 w-4 mr-2" /> 詳細表示
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {hourlyUsage.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 w-12"
                    >
                      <div
                        className="w-8 bg-blue-500 rounded-t"
                        style={{ height: `${item.usage * 2}px` }}
                      ></div>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                  ))}
                </div>
                {/* Y軸 */}
                <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-400 py-2">
                  <span>50台</span>
                  <span>40台</span>
                  <span>30台</span>
                  <span>20台</span>
                  <span>10台</span>
                  <span>0台</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* システム状態カード */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              システム状態
            </CardTitle>
            <CardDescription>主要システムコンポーネント</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    name: "ネットワーク接続",
                    status: "正常",
                    icon: <Activity className="h-4 w-4 text-green-500" />,
                  },
                  {
                    name: "データベース",
                    status: "正常",
                    icon: <HardDrive className="h-4 w-4 text-green-500" />,
                  },
                  {
                    name: "セキュリティシステム",
                    status: "注意",
                    icon: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
                    warning: "アップデートが必要",
                  },
                  {
                    name: "バックアップシステム",
                    status: "正常",
                    icon: <Check className="h-4 w-4 text-green-500" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={`${
                          item.status === "正常"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        } font-normal`}
                      >
                        {item.status}
                      </Badge>

                      {item.warning && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-yellow-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.warning}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PCリストテーブル */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">
                PCインベントリ
              </CardTitle>
              <CardDescription>
                登録済みPCの状況を確認してください
              </CardDescription>
            </div>
            <Link href="/pc">
              <Button variant="outline" size="sm" className="border-gray-200">
                すべて表示
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="hidden md:table-cell">
                      タイプ
                    </TableHead>
                    <TableHead className="hidden md:table-cell">IP</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      最近の活動
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      担当者
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      使用率
                    </TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pcs.map((pc) => (
                    <TableRow key={pc.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{pc.name}</div>
                        <div className="text-xs text-gray-500 md:hidden mt-1">
                          {pc.ip}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(pc.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {pc.type === "デスクトップ" ? (
                            <Cpu className="h-3 w-3 text-gray-500" />
                          ) : pc.type === "ノートPC" ? (
                            <Smartphone className="h-3 w-3 text-gray-500" />
                          ) : (
                            <Server className="h-3 w-3 text-gray-500" />
                          )}
                          <span>{pc.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-500">
                        {pc.ip}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-500">
                        {pc.lastSeen}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {pc.owner && (
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2 text-xs">
                              {pc.owner.charAt(0)}
                            </div>
                            <span>{pc.owner}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {pc.status !== "offline" &&
                        pc.status !== "maintenance" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getUsageRateColor(
                                  pc.usageRate || 0
                                )}`}
                                style={{ width: `${pc.usageRate || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {pc.usageRate}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Settings className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>詳細設定</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>編集</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>削除</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            {lastUpdated ? `最終更新: ${lastUpdated}` : "読み込み中..."}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              全{stats.total}台中 {stats.online}台オンライン
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              className="h-8 px-2 text-xs"
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              更新
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
