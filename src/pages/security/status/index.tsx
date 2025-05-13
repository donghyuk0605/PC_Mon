"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  AlertTriangle,
  BarChart,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Hash,
  Info,
  LockKeyhole,
  MonitorSmartphone,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// セキュリティイベント型定義
type SecurityEvent = {
  id: number;
  timestamp: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  source: string;
  device: string;
  description: string;
  status: "new" | "investigating" | "resolved" | "false-positive";
  resolutionTime?: string;
};

// セキュリティスコア型定義
type SecurityScore = {
  category: string;
  score: number;
  maxScore: number;
  recommendations: string[];
};

// PC型定義
type PC = {
  id: number;
  name: string;
  ip: string;
  lastScan: string;
  securityScore: number;
  antivirusStatus: string;
  firewallStatus: string;
  encryptionStatus: string;
  vulnerabilities: number;
  patchStatus: string;
  osVersion: string;
  department?: string;
};

// セキュリティダッシュボードコンポーネント
export default function SecurityStatusPage() {
  // 状態管理
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityScores, setSecurityScores] = useState<SecurityScore[]>([]);
  const [pcs, setPcs] = useState<PC[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [overallScore, setOverallScore] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          // セキュリティイベントモックデータ
          const mockSecurityEvents: SecurityEvent[] = [
            {
              id: 1,
              timestamp: "2024-05-09T08:23:15",
              type: "malware-detected",
              severity: "high",
              source: "アンチウイルス",
              device: "開発-PC-001",
              description:
                "トロイの木馬脅威が検出されました (Trojan.Generic.23876)",
              status: "resolved",
              resolutionTime: "2024-05-09T09:15:32",
            },
            {
              id: 2,
              timestamp: "2024-05-08T14:48:33",
              type: "unusual-login",
              severity: "medium",
              source: "認証サービス",
              device: "経理-PC-008",
              description: "通常と異なる位置からのログイン試行を検出しました",
              status: "false-positive",
              resolutionTime: "2024-05-08T15:22:10",
            },
            {
              id: 3,
              timestamp: "2024-05-10T06:12:05",
              type: "multiple-login-failures",
              severity: "medium",
              source: "Windowsイベントログ",
              device: "マーケ-PC-003",
              description: "5回連続のログイン失敗を検出しました",
              status: "investigating",
            },
            {
              id: 4,
              timestamp: "2024-05-10T02:35:18",
              type: "firewall-disabled",
              severity: "high",
              source: "セキュリティ管理者",
              device: "デザイン-PC-002",
              description: "ファイアウォールがユーザーにより無効化されました",
              status: "new",
            },
            {
              id: 5,
              timestamp: "2024-05-07T11:20:44",
              type: "critical-update-missed",
              severity: "high",
              source: "パッチマネージャー",
              device: "人事-PC-004",
              description:
                "重要なWindowsセキュリティ更新が30日以上遅延しています",
              status: "resolved",
              resolutionTime: "2024-05-09T10:15:32",
            },
            {
              id: 6,
              timestamp: "2024-05-10T07:42:12",
              type: "unauthorized-software",
              severity: "medium",
              source: "ソフトウェアイベントリ",
              device: "開発-PC-001",
              description:
                "未承認ソフトウェア(BrowserTorrent)のインストールを検出しました",
              status: "new",
            },
            {
              id: 7,
              timestamp: "2024-05-09T16:54:23",
              type: "sensitive-data-access",
              severity: "critical",
              source: "データアクセスモニタ",
              device: "マーケ-PC-003",
              description: "機密顧客データへの異常なアクセスを検出しました",
              status: "investigating",
            },
            {
              id: 8,
              timestamp: "2024-05-06T09:30:11",
              type: "outdated-antivirus",
              severity: "medium",
              source: "セキュリティ管理者",
              device: "営業-PC-007",
              description: "アンチウイルス定義が7日以上更新されていません",
              status: "resolved",
              resolutionTime: "2024-05-06T13:45:22",
            },
          ];

          // セキュリティスコアモックデータ
          const mockSecurityScores: SecurityScore[] = [
            {
              category: "エンドポイントセキュリティ",
              score: 85,
              maxScore: 100,
              recommendations: [
                "全PCに最新アンチウイルスをインストール",
                "リムーバブルメディア制御ポリシーを適用",
              ],
            },
            {
              category: "パッチ管理",
              score: 68,
              maxScore: 100,
              recommendations: [
                "全PCのOSパッチ状況を確認",
                "自動更新ポリシーを適用",
                "パッチ管理ソリューション導入検討",
              ],
            },
            {
              category: "アカウント管理",
              score: 92,
              maxScore: 100,
              recommendations: [
                "アカウント無効化ポリシー確認",
                "管理者権限制限強化",
              ],
            },
            {
              category: "データ保護",
              score: 76,
              maxScore: 100,
              recommendations: [
                "全ノートPCにディスク暗号化適用",
                "機密データアクセス制御強化",
                "定期バックアップ検証",
              ],
            },
            {
              category: "ネットワークセキュリティ",
              score: 88,
              maxScore: 100,
              recommendations: [
                "ゲストと内部ネットワーク分離強化",
                "ネットワークトラフィック監視強化",
              ],
            },
          ];

          // PCモックデータ
          const mockPCs: PC[] = [
            {
              id: 1,
              name: "開発-PC-001",
              ip: "192.168.1.101",
              lastScan: "2024-05-10T07:32:15",
              securityScore: 83,
              antivirusStatus: "active",
              firewallStatus: "active",
              encryptionStatus: "partial",
              vulnerabilities: 2,
              patchStatus: "up-to-date",
              osVersion: "Windows 11 Pro 22H2",
              department: "開発チーム",
            },
            {
              id: 2,
              name: "デザイン-PC-002",
              ip: "192.168.1.102",
              lastScan: "2024-05-10T03:45:22",
              securityScore: 62,
              antivirusStatus: "active",
              firewallStatus: "disabled",
              encryptionStatus: "none",
              vulnerabilities: 5,
              patchStatus: "overdue",
              osVersion: "macOS Sonoma 14.3",
              department: "デザインチーム",
            },
            {
              id: 3,
              name: "マーケ-PC-003",
              ip: "192.168.1.103",
              lastScan: "2024-05-10T08:15:00",
              securityScore: 78,
              antivirusStatus: "active",
              firewallStatus: "active",
              encryptionStatus: "full",
              vulnerabilities: 3,
              patchStatus: "up-to-date",
              osVersion: "Windows 11 Home 22H2",
              department: "マーケティングチーム",
            },
            {
              id: 4,
              name: "人事-PC-004",
              ip: "192.168.1.104",
              lastScan: "2024-05-09T14:22:36",
              securityScore: 91,
              antivirusStatus: "active",
              firewallStatus: "active",
              encryptionStatus: "full",
              vulnerabilities: 0,
              patchStatus: "up-to-date",
              osVersion: "Windows 11 Pro 22H2",
              department: "人事チーム",
            },
            {
              id: 5,
              name: "営業-PC-007",
              ip: "192.168.1.107",
              lastScan: "2024-05-10T06:40:12",
              securityScore: 76,
              antivirusStatus: "outdated",
              firewallStatus: "active",
              encryptionStatus: "none",
              vulnerabilities: 4,
              patchStatus: "attention",
              osVersion: "Windows 10 Pro 21H2",
              department: "営業チーム",
            },
            {
              id: 6,
              name: "経理-PC-008",
              ip: "192.168.1.108",
              lastScan: "2024-05-09T17:55:42",
              securityScore: 88,
              antivirusStatus: "active",
              firewallStatus: "active",
              encryptionStatus: "full",
              vulnerabilities: 1,
              patchStatus: "up-to-date",
              osVersion: "Windows 11 Pro 22H2",
              department: "経理チーム",
            },
          ];

          // 全体スコア計算
          const totalScore = mockSecurityScores.reduce(
            (sum, s) => sum + s.score,
            0
          );
          const overallScoreValue = Math.round(
            totalScore / mockSecurityScores.length
          );

          setSecurityEvents(mockSecurityEvents);
          setSecurityScores(mockSecurityScores);
          setPcs(mockPCs);
          setOverallScore(overallScoreValue);
          setLastUpdated(new Date().toLocaleString());
          setLoading(false);
        }, 1200);
      } catch (err) {
        console.error("データ読み込み中のエラー:", err);
        setError("セキュリティ状況の取得に失敗しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // イベントフィルター適用
  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch =
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || event.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // バッジ色設定
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <AlertCircle className="h-3 w-3 mr-1" /> 重大
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <AlertTriangle className="h-3 w-3 mr-1" /> 高
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="h-3 w-3 mr-1" /> 中
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Info className="h-3 w-3 mr-1" /> 低
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <Info className="h-3 w-3 mr-1" /> 情報
          </Badge>
        );
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500 hover:bg-blue-600">新規</Badge>;
      case "investigating":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">調査中</Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">解決済み</Badge>
        );
      case "false-positive":
        return <Badge className="bg-gray-500 hover:bg-gray-600">誤検知</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusIndicator = (status: string, type: string) => {
    if (type === "antivirus") {
      switch (status) {
        case "active":
          return <ShieldCheck className="h-4 w-4 text-green-500" />;
        case "disabled":
          return <ShieldX className="h-4 w-4 text-red-500" />;
        case "outdated":
          return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
        default:
          return <Shield className="h-4 w-4 text-gray-500" />;
      }
    }
    if (type === "firewall") {
      switch (status) {
        case "active":
          return <LockKeyhole className="h-4 w-4 text-green-500" />;
        case "disabled":
          return <ShieldX className="h-4 w-4 text-red-500" />;
        default:
          return <Shield className="h-4 w-4 text-gray-500" />;
      }
    }
    if (type === "encryption") {
      switch (status) {
        case "full":
          return <LockKeyhole className="h-4 w-4 text-green-500" />;
        case "partial":
          return <LockKeyhole className="h-4 w-4 text-yellow-500" />;
        case "none":
          return <ShieldX className="h-4 w-4 text-red-500" />;
        default:
          return <LockKeyhole className="h-4 w-4 text-gray-500" />;
      }
    }
    if (type === "patch") {
      switch (status) {
        case "up-to-date":
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "attention":
          return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        case "overdue":
          return <AlertTriangle className="h-4 w-4 text-red-500" />;
        default:
          return <Clock className="h-4 w-4 text-gray-500" />;
      }
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-2 h-7 w-7 text-blue-600" />
            セキュリティ状況
          </h1>
          <p className="text-gray-500 mt-1">
            全システムのリアルタイムなセキュリティ状態を監視します
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            更新
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            セキュリティレポート
          </Button>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="font-medium">エラー</div>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            概要
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            セキュリティイベント
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4" />
            デバイスセキュリティ
          </TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          {/* 全体セキュリティスコア */}
          <div className="grid gap-6 md:grid-cols-6">
            <Card className="md:col-span-2 border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  総合セキュリティスコア
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-32">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                    <span className="text-sm text-gray-500">
                      データ読み込み中...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className={`${getScoreColor(
                            overallScore
                          )} transition-all duration-500 ease-in-out`}
                          strokeWidth="10"
                          strokeDasharray={`${
                            (overallScore / 100) * 251.2
                          } 251.2`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold">{overallScore}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mt-1">
                        最終更新: {lastUpdated}
                      </div>
                      <div className="mt-2 space-x-1">
                        {overallScore >= 90 && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            良好
                          </Badge>
                        )}
                        {overallScore >= 70 && overallScore < 90 && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            注意
                          </Badge>
                        )}
                        {overallScore >= 50 && overallScore < 70 && (
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                            脆弱
                          </Badge>
                        )}
                        {overallScore < 50 && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                            危険
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 主要セキュリティ統計 */}
            <Card className="md:col-span-4 border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">主要セキュリティ統計</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm text-gray-500">新規アラート</div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {loading
                          ? "-"
                          : securityEvents.filter((e) => e.status === "new")
                              .length}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm text-gray-500">調査中</div>
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {loading
                          ? "-"
                          : securityEvents.filter(
                              (e) => e.status === "investigating"
                            ).length}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm text-gray-500">脆弱デバイス</div>
                    <div className="flex items-center">
                      <ShieldAlert className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {loading
                          ? "-"
                          : pcs.filter((pc) => pc.securityScore < 70).length}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm text-gray-500">検出脆弱性数</div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-2xl font-bold">
                        {loading
                          ? "-"
                          : pcs.reduce(
                              (sum, pc) => sum + pc.vulnerabilities,
                              0
                            )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-sm font-medium">パッチ状態</div>
                    <div className="text-xs text-gray-500">
                      {loading
                        ? "-"
                        : `${
                            pcs.filter((pc) => pc.patchStatus === "up-to-date")
                              .length
                          }/${pcs.length} 最新`}
                    </div>
                  </div>
                  <Progress
                    value={
                      loading
                        ? 0
                        : (pcs.filter((pc) => pc.patchStatus === "up-to-date")
                            .length /
                            pcs.length) *
                          100
                    }
                    className="h-2"
                  />
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-sm font-medium">暗号化状態</div>
                    <div className="text-xs text-gray-500">
                      {loading
                        ? "-"
                        : `${
                            pcs.filter((pc) => pc.encryptionStatus === "full")
                              .length
                          }/${pcs.length} 完全暗号化`}
                    </div>
                  </div>
                  <Progress
                    value={
                      loading
                        ? 0
                        : (pcs.filter((pc) => pc.encryptionStatus === "full")
                            .length /
                            pcs.length) *
                          100
                    }
                    className="h-2"
                    indicatorClassName={
                      loading
                        ? "bg-gray-500"
                        : pcs.filter((pc) => pc.encryptionStatus === "full")
                            .length /
                            pcs.length >=
                          0.9
                        ? "bg-green-500"
                        : pcs.filter((pc) => pc.encryptionStatus === "full")
                            .length /
                            pcs.length >=
                          0.7
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* カテゴリ別スコア */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                カテゴリ別セキュリティスコア
              </CardTitle>
              <CardDescription>各領域の現在スコア</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-12 h-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {securityScores.map((scoreItem) => (
                    <div key={scoreItem.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{scoreItem.category}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold">
                            {scoreItem.score}/{scoreItem.maxScore}
                          </div>
                          <Badge
                            className={`${
                              scoreItem.score / scoreItem.maxScore >= 0.9
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : scoreItem.score / scoreItem.maxScore >= 0.7
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                : scoreItem.score / scoreItem.maxScore >= 0.5
                                ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {scoreItem.score / scoreItem.maxScore >= 0.9
                              ? "良好"
                              : scoreItem.score / scoreItem.maxScore >= 0.7
                              ? "注意"
                              : scoreItem.score / scoreItem.maxScore >= 0.5
                              ? "脆弱"
                              : "危険"}
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={(scoreItem.score / scoreItem.maxScore) * 100}
                        className="h-3"
                      />
                      <div className="ml-2 space-y-1">
                        {scoreItem.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start text-sm">
                            <AlertCircle className="h-3 w-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 最近のイベント */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                    最近のセキュリティイベント
                  </CardTitle>
                  <CardDescription>最近発生した主要イベント</CardDescription>
                </div>
                <Link href="#events">
                  <Button variant="outline" size="sm">
                    すべて見る
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-3 border border-gray-200 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between">
                        <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : securityEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                  <p className="text-gray-500">
                    セキュリティイベントはありません
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {securityEvents
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    )
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between">
                          <div className="font-medium flex items-center">
                            {getSeverityBadge(event.severity)}
                            <span className="ml-2">{event.device}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1 text-sm">{event.description}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            出典: {event.source}
                          </div>
                          <div>{getStatusBadge(event.status)}</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティイベントタブ */}
        <TabsContent value="events" className="space-y-6" id="events">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>セキュリティイベントログ</CardTitle>
                  <CardDescription>
                    すべてのイベント記録と対応状況
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="イベント検索..."
                      className="pl-9 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={severityFilter}
                      onValueChange={setSeverityFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="深刻度フィルター" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="critical">重大</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="info">情報</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="状態フィルター" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="new">新規</SelectItem>
                        <SelectItem value="investigating">調査中</SelectItem>
                        <SelectItem value="resolved">解決済み</SelectItem>
                        <SelectItem value="false-positive">誤検知</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">
                    データ読み込み中...
                  </span>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">結果がありません</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[5%] text-center">ID</TableHead>
                        <TableHead className="w-[15%]">
                          タイムスタンプ
                        </TableHead>
                        <TableHead className="w-[10%]">深刻度</TableHead>
                        <TableHead className="w-[15%]">デバイス</TableHead>
                        <TableHead className="w-[30%]">説明</TableHead>
                        <TableHead className="w-[10%]">出典</TableHead>
                        <TableHead className="w-[10%]">状態</TableHead>
                        <TableHead className="w-[5%] text-right">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                        )
                        .map((event) => (
                          <TableRow key={event.id} className="hover:bg-gray-50">
                            <TableCell className="text-center font-medium">
                              {event.id}
                            </TableCell>
                            <TableCell>
                              {new Date(event.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {getSeverityBadge(event.severity)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MonitorSmartphone className="h-4 w-4 mr-1 text-gray-500" />
                                {event.device}
                              </div>
                            </TableCell>
                            <TableCell>{event.description}</TableCell>
                            <TableCell>{event.source}</TableCell>
                            <TableCell>
                              {getStatusBadge(event.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4 text-gray-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>詳細</p>
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
            <CardFooter className="bg-gray-50 border-t border-gray-200 justify-between py-3">
              <div className="text-sm text-gray-500">
                合計 {filteredEvents.length} 件 (全 {securityEvents.length} 件)
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  レポート生成
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* デバイスセキュリティタブ */}
        <TabsContent value="devices" className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>デバイスセキュリティ状況</CardTitle>
                  <CardDescription>
                    すべてのPCとデバイスのセキュリティ状態
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    フィルター
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Terminal className="h-4 w-4 mr-2" />
                    一括管理
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">
                    データ読み込み中...
                  </span>
                </div>
              ) : pcs.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <Server className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    登録されたデバイスがありません
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[5%] text-center">ID</TableHead>
                        <TableHead className="w-[15%]">デバイス情報</TableHead>
                        <TableHead className="w-[10%]">
                          セキュリティスコア
                        </TableHead>
                        <TableHead className="w-[10%]">
                          アンチウイルス
                        </TableHead>
                        <TableHead className="w-[10%]">
                          ファイアウォール
                        </TableHead>
                        <TableHead className="w-[10%]">暗号化</TableHead>
                        <TableHead className="w-[10%]">脆弱性</TableHead>
                        <TableHead className="w-[10%]">パッチ状態</TableHead>
                        <TableHead className="w-[5%] text-right">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pcs
                        .sort((a, b) => a.securityScore - b.securityScore)
                        .map((pc) => (
                          <TableRow key={pc.id} className="hover:bg-gray-50">
                            <TableCell className="text-center font-medium">
                              {pc.id}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{pc.name}</div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Hash className="h-3 w-3 mr-1" />
                                {pc.ip}
                              </div>
                              {pc.department && (
                                <div className="text-xs text-gray-500">
                                  {pc.department}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getScoreColor(
                                    pc.securityScore
                                  )}`}
                                >
                                  {pc.securityScore}
                                </div>
                                <div className="text-xs">
                                  <div>
                                    {pc.securityScore >= 90
                                      ? "良好"
                                      : pc.securityScore >= 70
                                      ? "注意"
                                      : pc.securityScore >= 50
                                      ? "脆弱"
                                      : "危険"}
                                  </div>
                                  <div className="text-gray-500">
                                    {new Date(pc.lastScan).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getStatusIndicator(
                                  pc.antivirusStatus,
                                  "antivirus"
                                )}
                                <span className="ml-1 capitalize">
                                  {pc.antivirusStatus === "active"
                                    ? "有効"
                                    : pc.antivirusStatus === "disabled"
                                    ? "無効"
                                    : pc.antivirusStatus === "outdated"
                                    ? "古い"
                                    : pc.antivirusStatus}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getStatusIndicator(
                                  pc.firewallStatus,
                                  "firewall"
                                )}
                                <span className="ml-1 capitalize">
                                  {pc.firewallStatus === "active"
                                    ? "有効"
                                    : pc.firewallStatus === "disabled"
                                    ? "無効"
                                    : pc.firewallStatus}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getStatusIndicator(
                                  pc.encryptionStatus,
                                  "encryption"
                                )}
                                <span className="ml-1 capitalize">
                                  {pc.encryptionStatus === "full"
                                    ? "完全"
                                    : pc.encryptionStatus === "partial"
                                    ? "部分"
                                    : pc.encryptionStatus === "none"
                                    ? "なし"
                                    : pc.encryptionStatus}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {pc.vulnerabilities > 0 ? (
                                <Badge
                                  className={`${
                                    pc.vulnerabilities > 3
                                      ? "bg-red-500"
                                      : pc.vulnerabilities > 1
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  {pc.vulnerabilities}件
                                </Badge>
                              ) : (
                                <Badge className="bg-green-500">なし</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getStatusIndicator(pc.patchStatus, "patch")}
                                <span className="ml-1 capitalize">
                                  {pc.patchStatus === "up-to-date"
                                    ? "最新"
                                    : pc.patchStatus === "attention"
                                    ? "注意"
                                    : pc.patchStatus === "overdue"
                                    ? "遅延"
                                    : pc.patchStatus}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {pc.osVersion}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Settings className="h-4 w-4 text-gray-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>セキュリティ管理</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/security/vulnerabilities?pc=${pc.id}`}
                                      >
                                        <Button variant="ghost" size="icon">
                                          <ExternalLink className="h-4 w-4 text-blue-500" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>脆弱性分析</p>
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
            <CardFooter className="bg-gray-50 border-t border-gray-200 justify-between py-3">
              <div className="text-sm text-gray-500">合計 {pcs.length} 台</div>
              <div className="flex gap-2">
                <Link href="/security/vulnerabilities">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    脆弱性分析
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
