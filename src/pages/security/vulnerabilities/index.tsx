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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  FileBarChart,
  Filter,
  Info,
  Laptop,
  Link,
  PieChart,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// 脆弱性アイテム型定義
type Vulnerability = {
  id: number;
  cveId: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "mitigated" | "resolved" | "accepted_risk";
  discoveryDate: string;
  affectedSystems: number;
  affectedAssets: string[];
  category: string;
  cvssScore: number;
  remediation: string;
  remediationDueDate?: string;
  assignedTo?: string;
  references: string[];
  patchAvailable: boolean;
  lastUpdated: string;
};

// PC型定義
type PC = {
  id: number;
  name: string;
  status: string;
  os: string;
  department: string;
  vulnerabilities: number;
  lastScan: string;
};

export default function VulnerabilityManagementPage() {
  // 状態管理
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [systems, setSystems] = useState<PC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Vulnerability>("cvssScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<Vulnerability | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [tabValue, setTabValue] = useState("vulnerabilities");

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 実際にはAPI呼び出しに置き換え
        setTimeout(() => {
          const mockVulnerabilities: Vulnerability[] = [
            {
              id: 1,
              cveId: "CVE-2023-32315",
              title: "Windows Print Spooler 権限昇格の脆弱性",
              description:
                "Windows Print Spooler サービスに存在する脆弱性により、攻撃者が権限昇格しシステムを制御できる恐れがあります。",
              severity: "critical",
              status: "open",
              discoveryDate: "2024-04-05",
              affectedSystems: 18,
              affectedAssets: [
                "開発-PC-001",
                "デザイン-PC-002",
                "サーバー-001",
              ],
              category: "権限昇格",
              cvssScore: 9.8,
              remediation:
                "Microsoft 提供の最新セキュリティパッチを適用してください。",
              remediationDueDate: "2024-05-10",
              assignedTo: "山田 太郎",
              references: [
                "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-32315",
                "https://nvd.nist.gov/vuln/detail/CVE-2023-32315",
              ],
              patchAvailable: true,
              lastUpdated: "2024-04-25",
            },
            {
              id: 2,
              cveId: "CVE-2023-38180",
              title: "Apache Log4j リモートコード実行の脆弱性",
              description:
                "Apache Log4j の脆弱性により、リモート攻撃者が任意のコードを実行できる可能性があります。",
              severity: "critical",
              status: "in_progress",
              discoveryDate: "2024-03-18",
              affectedSystems: 7,
              affectedAssets: ["サーバー-001", "サーバー-002"],
              category: "コード実行",
              cvssScore: 10.0,
              remediation: "Log4j を 2.15.0 以上に更新してください。",
              remediationDueDate: "2024-04-30",
              assignedTo: "鈴木 花子",
              references: [
                "https://logging.apache.org/log4j/2.x/security.html",
                "https://nvd.nist.gov/vuln/detail/CVE-2023-38180",
              ],
              patchAvailable: true,
              lastUpdated: "2024-04-20",
            },
            {
              id: 3,
              cveId: "CVE-2024-0567",
              title: "Chrome ブラウザ メモリエラーの脆弱性",
              description:
                "Google Chrome の V8 JavaScript エンジンに存在するメモリエラーにより、サンドボックス脱出が可能です。",
              severity: "high",
              status: "mitigated",
              discoveryDate: "2024-02-14",
              affectedSystems: 42,
              affectedAssets: [
                "開発-PC-001",
                "デザイン-PC-002",
                "マーケ-PC-003",
                "人事-PC-004",
              ],
              category: "メモリエラー",
              cvssScore: 8.4,
              remediation: "Chrome を最新バージョンに更新してください。",
              assignedTo: "佐藤 次郎",
              references: [
                "https://chromereleases.googleblog.com/2024/02/stable-channel-update-for-desktop.html",
                "https://nvd.nist.gov/vuln/detail/CVE-2024-0567",
              ],
              patchAvailable: true,
              lastUpdated: "2024-03-05",
            },
            {
              id: 4,
              cveId: "CVE-2023-36884",
              title: "Microsoft Office リモートコード実行の脆弱性",
              description:
                "Microsoft Office 製品に存在する脆弱性により、細工された文書を開いた際にリモートコード実行が可能です。",
              severity: "high",
              status: "resolved",
              discoveryDate: "2024-01-20",
              affectedSystems: 35,
              affectedAssets: ["マーケ-PC-003", "人事-PC-004", "財務-PC-001"],
              category: "コード実行",
              cvssScore: 7.8,
              remediation:
                "最新の Microsoft Office セキュリティ更新を適用してください。",
              assignedTo: "高橋 健",
              references: [
                "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-36884",
                "https://nvd.nist.gov/vuln/detail/CVE-2023-36884",
              ],
              patchAvailable: true,
              lastUpdated: "2024-02-15",
            },
            {
              id: 5,
              cveId: "CVE-2023-42793",
              title: "Adobe Acrobat Reader ヒープオーバーフローの脆弱性",
              description:
                "Adobe Acrobat Reader のヒープベースバッファオーバーフローにより、任意コード実行が可能になる恐れがあります。",
              severity: "medium",
              status: "open",
              discoveryDate: "2024-03-08",
              affectedSystems: 28,
              affectedAssets: ["マーケ-PC-003", "人事-PC-004", "開発-PC-001"],
              category: "メモリエラー",
              cvssScore: 6.3,
              remediation: "最新の Adobe Acrobat Reader に更新してください。",
              remediationDueDate: "2024-05-20",
              assignedTo: "山田 太郎",
              references: [
                "https://helpx.adobe.com/security/products/acrobat/apsb23-46.html",
                "https://nvd.nist.gov/vuln/detail/CVE-2023-42793",
              ],
              patchAvailable: true,
              lastUpdated: "2024-04-10",
            },
            {
              id: 6,
              cveId: "CVE-2023-45140",
              title: "Oracle Java SE の脆弱性",
              description:
                "Oracle Java SE の脆弱性により、未認証のネットワーク攻撃者がシステムアクセス権を取得できる恐れがあります。",
              severity: "medium",
              status: "in_progress",
              discoveryDate: "2024-02-20",
              affectedSystems: 12,
              affectedAssets: ["サーバー-001", "サーバー-002", "開発-PC-001"],
              category: "権限昇格",
              cvssScore: 5.9,
              remediation:
                "最新の Java SE セキュリティアップデートを適用してください。",
              remediationDueDate: "2024-05-15",
              assignedTo: "鈴木 花子",
              references: [
                "https://www.oracle.com/security-alerts/cpujan2024.html",
                "https://nvd.nist.gov/vuln/detail/CVE-2023-45140",
              ],
              patchAvailable: true,
              lastUpdated: "2024-03-25",
            },
            {
              id: 7,
              cveId: "CVE-2023-50164",
              title: "OpenSSL 認証バイパスの脆弱性",
              description:
                "OpenSSL の脆弱性により、攻撃者が認証をバイパスし機密情報にアクセスできる恐れがあります。",
              severity: "high",
              status: "accepted_risk",
              discoveryDate: "2024-01-12",
              affectedSystems: 6,
              affectedAssets: ["サーバー-001", "サーバー-002"],
              category: "認証バイパス",
              cvssScore: 7.5,
              remediation:
                "OpenSSL を 3.2.1 以上に更新するか代替認証メカニズムを実装してください。",
              assignedTo: "高橋 健",
              references: [
                "https://www.openssl.org/news/secadv/20231207.txt",
                "https://nvd.nist.gov/vuln/detail/CVE-2023-50164",
              ],
              patchAvailable: true,
              lastUpdated: "2024-02-10",
            },
            {
              id: 8,
              cveId: "CVE-2024-0520",
              title: "Windows Server NTLM リレー攻撃の脆弱性",
              description:
                "Windows Server の NTLM 認証プロトコルに存在する脆弱性により、中間者攻撃が可能です。",
              severity: "medium",
              status: "open",
              discoveryDate: "2024-04-10",
              affectedSystems: 3,
              affectedAssets: ["サーバー-001", "サーバー-002"],
              category: "認証",
              cvssScore: 6.8,
              remediation:
                "最新の Windows セキュリティアップデートを適用し、NTLM の代わりに Kerberos を使用するよう設定してください。",
              remediationDueDate: "2024-05-30",
              assignedTo: "未割当",
              references: [
                "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-0520",
                "https://nvd.nist.gov/vuln/detail/CVE-2024-0520",
              ],
              patchAvailable: true,
              lastUpdated: "2024-04-15",
            },
            {
              id: 9,
              cveId: "CVE-2023-44487",
              title: "HTTP/2 DoS の脆弱性",
              description:
                "HTTP/2 プロトコル実装の脆弱性により、サービス拒否(DoS)攻撃が可能になります。",
              severity: "low",
              status: "resolved",
              discoveryDate: "2023-10-10",
              affectedSystems: 2,
              affectedAssets: ["サーバー-001"],
              category: "サービス拒否",
              cvssScore: 3.7,
              remediation:
                "Webサーバーソフトを最新に更新し、HTTP/2 ストリーム制限を構成してください。",
              assignedTo: "鈴木 花子",
              references: [
                "https://nvd.nist.gov/vuln/detail/CVE-2023-44487",
                "https://github.blog/2023-10-10-addressing-the-http-2-rapid-reset-vulnerability/",
              ],
              patchAvailable: true,
              lastUpdated: "2024-01-05",
            },
          ];

          const mockSystems: PC[] = [
            {
              id: 1,
              name: "開発-PC-001",
              status: "online",
              os: "Windows 11 Pro",
              department: "開発部",
              vulnerabilities: 4,
              lastScan: "2024-04-28",
            },
            {
              id: 2,
              name: "デザイン-PC-002",
              status: "online",
              os: "Windows 11 Pro",
              department: "デザイン部",
              vulnerabilities: 2,
              lastScan: "2024-04-27",
            },
            {
              id: 3,
              name: "マーケ-PC-003",
              status: "offline",
              os: "Windows 10 Enterprise",
              department: "マーケティング部",
              vulnerabilities: 3,
              lastScan: "2024-04-20",
            },
            {
              id: 4,
              name: "人事-PC-004",
              status: "maintenance",
              os: "Windows 11 Pro",
              department: "人事部",
              vulnerabilities: 3,
              lastScan: "2024-04-15",
            },
            {
              id: 5,
              name: "サーバー-001",
              status: "online",
              os: "Windows Server 2022",
              department: "IT部",
              vulnerabilities: 6,
              lastScan: "2024-04-28",
            },
            {
              id: 6,
              name: "サーバー-002",
              status: "online",
              os: "Ubuntu Server 20.04 LTS",
              department: "IT部",
              vulnerabilities: 4,
              lastScan: "2024-04-26",
            },
            {
              id: 7,
              name: "財務-PC-001",
              status: "online",
              os: "Windows 10 Pro",
              department: "財務部",
              vulnerabilities: 1,
              lastScan: "2024-04-25",
            },
          ];

          setVulnerabilities(mockVulnerabilities);
          setSystems(mockSystems);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("データ読み込み中のエラー:", err);
        setError("脆弱性情報の取得に失敗しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ソート処理
  const handleSort = (field: keyof Vulnerability) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // フィルタ＆ソート済みリスト
  const filteredVulnerabilities = vulnerabilities
    .filter((vuln) => {
      const matchesSearch =
        vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vuln.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vuln.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || vuln.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || vuln.status === statusFilter;
      const matchesSeverity =
        severityFilter === "all" || vuln.severity === severityFilter;
      return (
        matchesSearch && matchesCategory && matchesStatus && matchesSeverity
      );
    })
    .sort((a, b) => {
      if (sortField === "cvssScore") {
        return sortDirection === "asc"
          ? a.cvssScore - b.cvssScore
          : b.cvssScore - a.cvssScore;
      }
      if (sortField === "discoveryDate" || sortField === "lastUpdated") {
        const dateA = new Date(a[sortField] || "").getTime();
        const dateB = new Date(b[sortField] || "").getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortField === "affectedSystems") {
        return sortDirection === "asc"
          ? a.affectedSystems - b.affectedSystems
          : b.affectedSystems - a.affectedSystems;
      }
      const valueA = a[sortField]?.toString().toLowerCase() || "";
      const valueB = b[sortField]?.toString().toLowerCase() || "";
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  // 深刻度バッジ
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
            <AlertCircle className="h-3 w-3 mr-1" /> 高
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
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  // 状態バッジ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-3 w-3 mr-1" /> 開始
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Clock className="h-3 w-3 mr-1" /> 進行中
          </Badge>
        );
      case "mitigated":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <ShieldCheck className="h-3 w-3 mr-1" /> 軽減済み
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 解決済み
          </Badge>
        );
      case "accepted_risk":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">
            <ShieldAlert className="h-3 w-3 mr-1" /> リスク受諾
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 詳細ダイアログ表示
  const viewVulnerabilityDetails = (vuln: Vulnerability) => {
    setSelectedVulnerability(vuln);
    setShowDetailsDialog(true);
  };

  // 統計データ
  const severityStats = {
    critical: vulnerabilities.filter((v) => v.severity === "critical").length,
    high: vulnerabilities.filter((v) => v.severity === "high").length,
    medium: vulnerabilities.filter((v) => v.severity === "medium").length,
    low: vulnerabilities.filter((v) => v.severity === "low").length,
  };
  const statusStats = {
    open: vulnerabilities.filter((v) => v.status === "open").length,
    in_progress: vulnerabilities.filter((v) => v.status === "in_progress")
      .length,
    mitigated: vulnerabilities.filter((v) => v.status === "mitigated").length,
    resolved: vulnerabilities.filter((v) => v.status === "resolved").length,
    accepted_risk: vulnerabilities.filter((v) => v.status === "accepted_risk")
      .length,
  };
  const categoryStats: Record<string, number> = {};
  vulnerabilities.forEach((v) => {
    categoryStats[v.category] = (categoryStats[v.category] || 0) + 1;
  });

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <AlertTriangle className="mr-2 h-7 w-7 text-red-600" />
            脆弱性管理
          </h1>
          <p className="text-gray-500 mt-1">
            システムの脆弱性を分析し、解決策を提示します
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
            <Shield className="h-4 w-4 mr-2" />
            スキャン開始
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

      {/* 統計カード */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              総脆弱性数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vulnerabilities.length}</div>
            <div className="text-xs text-gray-500 mt-1">検出された脆弱性</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              重大
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {severityStats.critical}
            </div>
            <div className="text-xs text-gray-500 mt-1">緊急対応必要</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              高
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {severityStats.high}
            </div>
            <div className="text-xs text-gray-500 mt-1">優先対応</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {severityStats.medium}
            </div>
            <div className="text-xs text-gray-500 mt-1">計画的対応</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              低
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {severityStats.low}
            </div>
            <div className="text-xs text-gray-500 mt-1">監視のみ</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              解決済み
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {statusStats.resolved}
            </div>
            <div className="text-xs text-gray-500 mt-1">完了</div>
          </CardContent>
        </Card>
      </div>

      {/* タブ */}
      <Tabs
        defaultValue="vulnerabilities"
        value={tabValue}
        onValueChange={setTabValue}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger
            value="vulnerabilities"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            脆弱性一覧
          </TabsTrigger>
          <TabsTrigger
            value="affected_systems"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Laptop className="h-4 w-4 mr-2" />
            影響システム
          </TabsTrigger>
        </TabsList>

        {/* 脆弱性一覧タブ */}
        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>脆弱性一覧</CardTitle>
                  <CardDescription>
                    検出された全ての脆弱性を管理します
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="CVE ID または 脆弱性名で検索..."
                      className="pl-9 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="カテゴリ絞り込み" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全カテゴリ</SelectItem>
                        {Object.keys(categoryStats).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="ステータス絞り込み" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全ステータス</SelectItem>
                        <SelectItem value="open">未対応</SelectItem>
                        <SelectItem value="in_progress">対応中</SelectItem>
                        <SelectItem value="mitigated">軽減済み</SelectItem>
                        <SelectItem value="resolved">解決済み</SelectItem>
                        <SelectItem value="accepted_risk">
                          リスク受諾
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="hidden sm:flex"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="w-[180px]">
                            <h4 className="font-medium mb-2">深刻度絞り込み</h4>
                            <Select
                              value={severityFilter}
                              onValueChange={setSeverityFilter}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="深刻度" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">全て</SelectItem>
                                <SelectItem value="critical">重大</SelectItem>
                                <SelectItem value="high">高</SelectItem>
                                <SelectItem value="medium">中</SelectItem>
                                <SelectItem value="low">低</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">読み込み中...</span>
                </div>
              ) : filteredVulnerabilities.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">結果がありません</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[15%]">CVE ID</TableHead>
                        <TableHead
                          className="w-[25%]"
                          onClick={() => handleSort("title")}
                        >
                          <div className="flex items-center">
                            脆弱性名
                            {sortField === "title" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                            {sortField !== "title" && (
                              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-[15%]">カテゴリ</TableHead>
                        <TableHead
                          className="w-[10%]"
                          onClick={() => handleSort("cvssScore")}
                        >
                          <div className="flex items-center">
                            CVSS
                            {sortField === "cvssScore" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                            {sortField !== "cvssScore" && (
                              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-[10%]">深刻度</TableHead>
                        <TableHead className="w-[10%]">ステータス</TableHead>
                        <TableHead
                          className="w-[10%]"
                          onClick={() => handleSort("discoveryDate")}
                        >
                          <div className="flex items-center">
                            発見日
                            {sortField === "discoveryDate" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                            {sortField !== "discoveryDate" && (
                              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-[5%] text-right">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVulnerabilities.map((vuln) => (
                        <TableRow key={vuln.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <a
                                href={`https://nvd.nist.gov/vuln/detail/${vuln.cveId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                {vuln.cveId}
                                <Link className="h-3 w-3 ml-1 inline" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{vuln.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {vuln.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs inline-block">
                              {vuln.category}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center font-medium">
                              <div
                                className={`${
                                  vuln.cvssScore >= 9.0
                                    ? "text-red-600"
                                    : vuln.cvssScore >= 7.0
                                    ? "text-orange-600"
                                    : vuln.cvssScore >= 4.0
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {vuln.cvssScore.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {vuln.patchAvailable ? (
                                  <span className="text-green-600 flex items-center justify-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />{" "}
                                    パッチあり
                                  </span>
                                ) : (
                                  <span className="text-red-600 flex items-center justify-center">
                                    <XCircle className="h-3 w-3 mr-1" />{" "}
                                    パッチなし
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getSeverityBadge(vuln.severity)}
                          </TableCell>
                          <TableCell>{getStatusBadge(vuln.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              <span>
                                {new Date(
                                  vuln.discoveryDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              影響: {vuln.affectedSystems} 台
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        viewVulnerabilityDetails(vuln)
                                      }
                                    >
                                      <Eye className="h-4 w-4 text-blue-500" />
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
                合計 {filteredVulnerabilities.length} 件 (全{" "}
                {vulnerabilities.length} 件)
              </div>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileBarChart className="h-4 w-4 mr-2" />
                        レポート生成
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>脆弱性レポートを生成</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        CSVエクスポート
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>CSVでダウンロード</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 影響システムタブ */}
        <TabsContent value="affected_systems" className="space-y-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>影響を受けるシステム</CardTitle>
                  <CardDescription>脆弱性を含むシステム一覧</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="システム名で検索..."
                      className="pl-9 w-full"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">読み込み中...</span>
                </div>
              ) : systems.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">システム情報がありません</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[20%]">システム名</TableHead>
                        <TableHead className="w-[15%]">OS</TableHead>
                        <TableHead className="w-[15%]">部署</TableHead>
                        <TableHead className="w-[10%]">状態</TableHead>
                        <TableHead className="w-[10%]">脆弱性数</TableHead>
                        <TableHead className="w-[15%]">最終スキャン</TableHead>
                        <TableHead className="w-[15%] text-right">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systems
                        .sort((a, b) => b.vulnerabilities - a.vulnerabilities)
                        .map((system) => (
                          <TableRow
                            key={system.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="flex items-center">
                                {system.status === "online" ? (
                                  <span className="w-2 h-2 mr-2 bg-green-500 rounded-full" />
                                ) : system.status === "offline" ? (
                                  <span className="w-2 h-2 mr-2 bg-red-500 rounded-full" />
                                ) : (
                                  <span className="w-2 h-2 mr-2 bg-yellow-500 rounded-full" />
                                )}
                                <span className="font-medium">
                                  {system.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Server
                                  className={`h-4 w-4 mr-1 ${
                                    system.os.includes("Windows")
                                      ? "text-blue-500"
                                      : system.os.includes("Ubuntu")
                                      ? "text-orange-500"
                                      : "text-gray-500"
                                  }`}
                                />
                                {system.os}
                              </div>
                            </TableCell>
                            <TableCell>{system.department}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  system.status === "online"
                                    ? "bg-green-600"
                                    : system.status === "offline"
                                    ? "bg-red-600"
                                    : "bg-yellow-600"
                                }
                              >
                                {system.status === "online"
                                  ? "オンライン"
                                  : system.status === "offline"
                                  ? "オフライン"
                                  : "保守中"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`font-bold rounded-full text-center py-1 ${
                                  system.vulnerabilities >= 5
                                    ? "bg-red-100 text-red-800"
                                    : system.vulnerabilities >= 3
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {system.vulnerabilities}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                {system.lastScan}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <Shield className="h-4 w-4 text-blue-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>スキャン</p>
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
                                        <Wrench className="h-4 w-4 text-green-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>自動パッチ</p>
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
                                        <Eye className="h-4 w-4 text-purple-500" />
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
                合計 {systems.length} 台、{vulnerabilities.length} 件
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <PieChart className="h-4 w-4 mr-2" />
                  レポート
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 詳細ダイアログ */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              脆弱性詳細
            </DialogTitle>
            <DialogDescription>
              選択した脆弱性の詳細情報と解決策を表示します
            </DialogDescription>
          </DialogHeader>
          {selectedVulnerability && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedVulnerability.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <a
                      href={`https://nvd.nist.gov/vuln/detail/${selectedVulnerability.cveId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center"
                    >
                      {selectedVulnerability.cveId}
                      <Link className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    {getSeverityBadge(selectedVulnerability.severity)}
                    <div className="ml-2 bg-gray-100 text-gray-800 rounded-md px-2 py-1 text-sm font-medium">
                      CVSS: {selectedVulnerability.cvssScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(selectedVulnerability.status)}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">
                  {selectedVulnerability.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    カテゴリ
                  </h4>
                  <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                    {selectedVulnerability.category}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">発見日</h4>
                  <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                    {new Date(
                      selectedVulnerability.discoveryDate
                    ).toLocaleDateString()}{" "}
                    (
                    {selectedVulnerability.lastUpdated &&
                      `最終更新: ${new Date(
                        selectedVulnerability.lastUpdated
                      ).toLocaleDateString()}`}
                    )
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">解決策</h4>
                <div className="px-3 py-2 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100">
                  {selectedVulnerability.remediation}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">
                  影響システム ({selectedVulnerability.affectedSystems} 台)
                </h4>
                <div className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                  <div className="flex flex-wrap gap-1">
                    {selectedVulnerability.affectedAssets.map((asset, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">参考資料</h4>
                <div className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                  <ul className="space-y-1">
                    {selectedVulnerability.references.map((ref, idx) => (
                      <li key={idx}>
                        <a
                          href={ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {ref.length > 60 ? ref.substring(0, 60) + "..." : ref}
                          <Link className="h-3 w-3 ml-1 inline" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">担当者</h4>
                  <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                    {selectedVulnerability.assignedTo || "未割当"}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    対応期限
                  </h4>
                  <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                    {selectedVulnerability.remediationDueDate
                      ? new Date(
                          selectedVulnerability.remediationDueDate
                        ).toLocaleDateString()
                      : "未設定"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedVulnerability && (
              <div className="flex justify-between w-full">
                <div>
                  {selectedVulnerability.patchAvailable && (
                    <Button variant="outline" className="mr-2">
                      <Wrench className="h-4 w-4 mr-2" />
                      パッチ適用
                    </Button>
                  )}
                </div>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  閉じる
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
