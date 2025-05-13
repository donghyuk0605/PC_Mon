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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowUpDown,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Filter,
  History,
  Info,
  Laptop,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// パッチ型
type Patch = {
  id: number;
  name: string;
  type: string;
  version: string;
  releaseDate: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "installed" | "pending" | "failed" | "scheduled";
  description: string;
  affectedSystems: number;
  installDate?: string;
  scheduledDate?: string;
  source: string;
  cveIds?: string[];
};

// PC 型
type PC = {
  id: number;
  name: string;
  status: string;
  os: string;
  lastUpdate: string;
};

export default function PatchManagementPage() {
  // state
  const [patches, setPatches] = useState<Patch[]>([]);
  const [pcs, setPcs] = useState<PC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Patch>("releaseDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPatch, setNewPatch] = useState<Partial<Patch>>({
    name: "",
    type: "os",
    version: "",
    releaseDate: new Date().toISOString().split("T")[0],
    severity: "medium",
    status: "pending",
    description: "",
    affectedSystems: 0,
    source: "Microsoft",
  });
  const [selectedPatchId, setSelectedPatchId] = useState<number | null>(null);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [deploymentDate, setDeploymentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedPCs, setSelectedPCs] = useState<number[]>([]);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const mockPatches: Patch[] = [
            {
              id: 1,
              name: "Windows 11 セキュリティ更新プログラム - KB5036893",
              type: "os",
              version: "KB5036893",
              releaseDate: "2024-04-08",
              severity: "critical",
              status: "installed",
              description:
                "重要なセキュリティ脆弱性を修正する Windows 11 の更新プログラムです。",
              affectedSystems: 15,
              installDate: "2024-04-15",
              source: "Microsoft",
              cveIds: ["CVE-2023-44142", "CVE-2023-44145"],
            },
            {
              id: 2,
              name: "Adobe Acrobat Reader 更新プログラム",
              type: "application",
              version: "23.006.20360",
              releaseDate: "2024-03-12",
              severity: "high",
              status: "pending",
              description:
                "複数の脆弱性を修正する Adobe Reader のセキュリティパッチです。",
              affectedSystems: 28,
              source: "Adobe",
              cveIds: ["CVE-2023-44512"],
            },
            {
              id: 3,
              name: "Chrome ブラウザ セキュリティアップデート",
              type: "application",
              version: "123.0.6312.105",
              releaseDate: "2024-04-02",
              severity: "high",
              status: "installed",
              description: "ゼロデイを含む複数のセキュリティ問題を解決します。",
              affectedSystems: 42,
              installDate: "2024-04-05",
              source: "Google",
              cveIds: ["CVE-2024-2234", "CVE-2024-2235", "CVE-2024-2236"],
            },
            {
              id: 4,
              name: "NVIDIA グラフィックドライバー アップデート",
              type: "driver",
              version: "551.86",
              releaseDate: "2024-04-22",
              severity: "medium",
              status: "scheduled",
              description:
                "パフォーマンス向上とセキュリティ強化のためのドライバー更新です。",
              affectedSystems: 18,
              scheduledDate: "2024-05-15",
              source: "NVIDIA",
            },
            {
              id: 5,
              name: "Java Runtime Environment アップデート",
              type: "framework",
              version: "JRE 8 Update 401",
              releaseDate: "2024-01-16",
              severity: "medium",
              status: "failed",
              description:
                "複数の脆弱性を修正する Java 8 のセキュリティアップデートです。",
              affectedSystems: 12,
              source: "Oracle",
              cveIds: ["CVE-2023-22127", "CVE-2023-22081"],
            },
            {
              id: 6,
              name: "Microsoft Office セキュリティ更新プログラム",
              type: "application",
              version: "16.0.17231.20214",
              releaseDate: "2024-04-09",
              severity: "high",
              status: "pending",
              description: "Office 製品群の脆弱性を修正するパッチです。",
              affectedSystems: 35,
              source: "Microsoft",
              cveIds: ["CVE-2024-21413", "CVE-2024-21304"],
            },
            {
              id: 7,
              name: "Windows Server 累積更新プログラム",
              type: "os",
              version: "KB5035845",
              releaseDate: "2024-04-09",
              severity: "critical",
              status: "scheduled",
              description:
                "Windows Server 2022 の重要なセキュリティおよび安定性向上。",
              affectedSystems: 6,
              scheduledDate: "2024-05-12",
              source: "Microsoft",
              cveIds: ["CVE-2024-26234", "CVE-2024-21408"],
            },
          ];

          const mockPCs: PC[] = [
            {
              id: 1,
              name: "開発-PC-001",
              status: "online",
              os: "Windows 11 Pro",
              lastUpdate: "2024-04-15",
            },
            {
              id: 2,
              name: "デザイン-PC-002",
              status: "online",
              os: "Windows 11 Pro",
              lastUpdate: "2024-04-10",
            },
            {
              id: 3,
              name: "マーケ-PC-003",
              status: "offline",
              os: "Windows 10 Enterprise",
              lastUpdate: "2024-03-25",
            },
            {
              id: 4,
              name: "人事-PC-004",
              status: "maintenance",
              os: "Windows 11 Pro",
              lastUpdate: "2024-02-28",
            },
            {
              id: 5,
              name: "サーバー-001",
              status: "online",
              os: "Windows Server 2022",
              lastUpdate: "2024-04-05",
            },
            {
              id: 6,
              name: "財務-PC-001",
              status: "online",
              os: "Windows 10 Pro",
              lastUpdate: "2024-04-12",
            },
          ];

          setPatches(mockPatches);
          setPcs(mockPCs);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("データ読み込みエラー:", err);
        setError("パッチ情報の取得に失敗しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ソート
  const handleSort = (field: keyof Patch) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // フィルタ＆並び替え
  const filteredPatches = patches
    .filter((patch) => {
      const matchesSearch =
        patch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patch.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patch.cveIds &&
          patch.cveIds.some((cve) =>
            cve.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesType = typeFilter === "all" || patch.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || patch.status === statusFilter;
      const matchesSeverity =
        severityFilter === "all" || patch.severity === severityFilter;

      return matchesSearch && matchesType && matchesStatus && matchesSeverity;
    })
    .sort((a, b) => {
      if (sortField === "releaseDate" || sortField === "installDate") {
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

  // バッジ生成
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "installed":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <Check className="h-3 w-3 mr-1" /> インストール済み
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Clock className="h-3 w-3 mr-1" /> 保留中
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">
            <CalendarClock className="h-3 w-3 mr-1" /> 予約済み
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <X className="h-3 w-3 mr-1" /> 失敗
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "os":
        return <Server className="h-4 w-4 text-blue-500" />;
      case "application":
        return <Laptop className="h-4 w-4 text-green-500" />;
      case "driver":
        return <Terminal className="h-4 w-4 text-purple-500" />;
      case "framework":
        return <ShieldCheck className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // 新規追加
  const handleAddPatch = () => {
    const newId = Math.max(...patches.map((p) => p.id), 0) + 1;
    const newPatchItem: Patch = {
      id: newId,
      name: newPatch.name || "",
      type: newPatch.type || "os",
      version: newPatch.version || "",
      releaseDate:
        newPatch.releaseDate || new Date().toISOString().split("T")[0],
      severity: newPatch.severity || "medium",
      status: newPatch.status || "pending",
      description: newPatch.description || "",
      affectedSystems: newPatch.affectedSystems || 0,
      source: newPatch.source || "",
      cveIds: newPatch.cveIds,
    };
    setPatches([...patches, newPatchItem]);
    setShowAddDialog(false);
    setNewPatch({
      name: "",
      type: "os",
      version: "",
      releaseDate: new Date().toISOString().split("T")[0],
      severity: "medium",
      status: "pending",
      description: "",
      affectedSystems: 0,
      source: "Microsoft",
    });
  };

  // 配布
  const handleDeployPatch = () => {
    if (selectedPatchId === null) return;
    setPatches(
      patches.map((p) =>
        p.id === selectedPatchId
          ? {
              ...p,
              status: "scheduled",
              scheduledDate: deploymentDate,
              affectedSystems: selectedPCs.length,
            }
          : p
      )
    );
    setShowDeployDialog(false);
    setSelectedPatchId(null);
    setSelectedPCs([]);
    setDeploymentDate(new Date().toISOString().split("T")[0]);
  };

  const handleDeletePatch = (id: number) => {
    if (window.confirm("本当にこのパッチを削除しますか？")) {
      setPatches(patches.filter((p) => p.id !== id));
    }
  };

  const openDeployDialog = (id: number) => {
    setSelectedPatchId(id);
    setShowDeployDialog(true);
  };

  // 統計
  const typeStats = {
    os: patches.filter((p) => p.type === "os").length,
    application: patches.filter((p) => p.type === "application").length,
    driver: patches.filter((p) => p.type === "driver").length,
    framework: patches.filter((p) => p.type === "framework").length,
  };
  const statusStats = {
    installed: patches.filter((p) => p.status === "installed").length,
    pending: patches.filter((p) => p.status === "pending").length,
    scheduled: patches.filter((p) => p.status === "scheduled").length,
    failed: patches.filter((p) => p.status === "failed").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Terminal className="mr-2 h-7 w-7 text-blue-600" />
            パッチ管理
          </h1>
          <p className="text-gray-500 mt-1">
            システムおよびアプリケーションのパッチを管理・配布します
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
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            パッチ追加
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
      <div className="grid gap-6 md:grid-cols-8">
        <div className="md:col-span-8 grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-8">
          {Object.entries({
            全体: patches.length,
            保留中: statusStats.pending,
            インストール済み: statusStats.installed,
            予約済み: statusStats.scheduled,
            失敗: statusStats.failed,
            OS: typeStats.os,
            アプリケーション: typeStats.application,
            ドライバー: typeStats.driver,
          }).map(([label, count]) => (
            <Card key={label} className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}件</div>
                <div className="text-xs text-gray-500 mt-1">パッチ</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* メインカード */}
        <Card className="md:col-span-8 border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>パッチ一覧</CardTitle>
                <CardDescription>
                  すべてのシステム・アプリケーションパッチを管理します
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="パッチ名・CVE ID検索..."
                    className="pl-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="種類フィルター" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての種類</SelectItem>
                      <SelectItem value="os">OS</SelectItem>
                      <SelectItem value="application">
                        アプリケーション
                      </SelectItem>
                      <SelectItem value="driver">ドライバー</SelectItem>
                      <SelectItem value="framework">フレームワーク</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="ステータスフィルター" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのステータス</SelectItem>
                      <SelectItem value="installed">
                        インストール済み
                      </SelectItem>
                      <SelectItem value="pending">保留中</SelectItem>
                      <SelectItem value="scheduled">予約済み</SelectItem>
                      <SelectItem value="failed">失敗</SelectItem>
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
                          <h4 className="font-medium mb-2">重大度フィルター</h4>
                          <Select
                            value={severityFilter}
                            onValueChange={setSeverityFilter}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="重大度フィルター" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">すべて</SelectItem>
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
                <span className="ml-2 text-gray-500">
                  データを読み込み中...
                </span>
              </div>
            ) : filteredPatches.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">検索結果がありません</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[5%] text-center">ID</TableHead>
                      <TableHead
                        className="w-[25%]"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          パッチ名
                          {sortField === "name" ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[10%]">種類</TableHead>
                      <TableHead className="w-[10%]">バージョン</TableHead>
                      <TableHead
                        className="w-[10%]"
                        onClick={() => handleSort("releaseDate")}
                      >
                        <div className="flex items-center">
                          リリース日
                          {sortField === "releaseDate" ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[8%]">重大度</TableHead>
                      <TableHead className="w-[8%]">ステータス</TableHead>
                      <TableHead
                        className="w-[6%] text-center"
                        onClick={() => handleSort("affectedSystems")}
                      >
                        <div className="flex items-center justify-center">
                          影響
                          {sortField === "affectedSystems" ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[15%]">CVE ID</TableHead>
                      <TableHead className="w-[8%] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatches.map((patch) => (
                      <TableRow key={patch.id} className="hover:bg-gray-50">
                        <TableCell className="text-center font-medium">
                          {patch.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{patch.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {patch.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getTypeIcon(patch.type)}
                            <span className="ml-1 capitalize">
                              {patch.type === "os"
                                ? "OS"
                                : patch.type === "application"
                                ? "アプリケーション"
                                : patch.type === "driver"
                                ? "ドライバー"
                                : patch.type === "framework"
                                ? "フレームワーク"
                                : patch.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {patch.source}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {patch.version}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarClock className="h-3 w-3 mr-1 text-gray-400" />
                            <span>
                              {new Date(patch.releaseDate).toLocaleDateString()}
                            </span>
                          </div>
                          {patch.installDate && (
                            <div className="text-xs text-gray-500">
                              インストール:{" "}
                              {new Date(patch.installDate).toLocaleDateString()}
                            </div>
                          )}
                          {patch.scheduledDate && (
                            <div className="text-xs text-green-600">
                              予定:{" "}
                              {new Date(
                                patch.scheduledDate
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getSeverityBadge(patch.severity)}
                        </TableCell>
                        <TableCell>{getStatusBadge(patch.status)}</TableCell>
                        <TableCell className="text-center">
                          <div className="font-medium">
                            {patch.affectedSystems} 台
                          </div>
                        </TableCell>
                        <TableCell>
                          {patch.cveIds && patch.cveIds.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {patch.cveIds.map((cve) => (
                                <span
                                  key={cve}
                                  className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {cve}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
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
                                    onClick={() => openDeployDialog(patch.id)}
                                    disabled={patch.status === "installed"}
                                  >
                                    <Play className="h-4 w-4 text-green-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>配布</p>
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
                                    onClick={() => handleDeletePatch(patch.id)}
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
          <CardFooter className="bg-gray-50 border-t border-gray-200 justify-between py-3">
            <div className="text-sm text-gray-500">
              合計 {filteredPatches.length} 件（全 {patches.length} 件中）
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      パッチ履歴
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>パッチ適用履歴を表示</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      エクスポート
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>CSVエクスポート</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* パッチ追加ダイアログ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-blue-600" />
              新規パッチ登録
            </DialogTitle>
            <DialogDescription>
              新しいパッチ情報を入力してください。必須項目をすべて入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">パッチ名</label>
                <Input
                  placeholder="パッチ名"
                  value={newPatch.name || ""}
                  onChange={(e) =>
                    setNewPatch({ ...newPatch, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">種類</label>
                <Select
                  value={newPatch.type || "os"}
                  onValueChange={(value) =>
                    setNewPatch({ ...newPatch, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種類選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="os">OS</SelectItem>
                    <SelectItem value="application">
                      アプリケーション
                    </SelectItem>
                    <SelectItem value="driver">ドライバー</SelectItem>
                    <SelectItem value="framework">フレームワーク</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">バージョン</label>
                <Input
                  placeholder="バージョン"
                  value={newPatch.version || ""}
                  onChange={(e) =>
                    setNewPatch({ ...newPatch, version: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">リリース日</label>
                <Input
                  type="date"
                  value={newPatch.releaseDate || ""}
                  onChange={(e) =>
                    setNewPatch({
                      ...newPatch,
                      releaseDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">重大度</label>
                <Select
                  value={newPatch.severity || "medium"}
                  onValueChange={(value) =>
                    setNewPatch({
                      ...newPatch,
                      severity: value as "critical" | "high" | "medium" | "low",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="重大度選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">重大</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ステータス</label>
                <Select
                  value={newPatch.status || "pending"}
                  onValueChange={(value) =>
                    setNewPatch({
                      ...newPatch,
                      status: value as
                        | "installed"
                        | "pending"
                        | "failed"
                        | "scheduled",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ステータス選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">保留中</SelectItem>
                    <SelectItem value="scheduled">予約済み</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">説明</label>
              <Input
                placeholder="パッチ概要"
                value={newPatch.description || ""}
                onChange={(e) =>
                  setNewPatch({ ...newPatch, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">供給元</label>
                <Input
                  placeholder="ベンダー/配布元"
                  value={newPatch.source || ""}
                  onChange={(e) =>
                    setNewPatch({ ...newPatch, source: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  影響を受けるシステム数
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newPatch.affectedSystems || ""}
                  onChange={(e) =>
                    setNewPatch({
                      ...newPatch,
                      affectedSystems: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                CVE ID（カンマ区切り）
              </label>
              <Input
                placeholder="例: CVE-2023-12345, CVE-2023-67890"
                value={newPatch.cveIds?.join(", ") || ""}
                onChange={(e) =>
                  setNewPatch({
                    ...newPatch,
                    cveIds: e.target.value
                      ? e.target.value.split(",").map((id) => id.trim())
                      : [],
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              キャンセル
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddPatch}
            >
              <Save className="h-4 w-4 mr-2" />
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* パッチ配布ダイアログ */}
      <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5 text-green-600" />
              パッチ配布
            </DialogTitle>
            <DialogDescription>
              選択したパッチをシステムに配布します。対象PCを選択し、スケジュールを設定してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">パッチ</label>
              <div className="p-3 border rounded-md bg-gray-50">
                <div className="font-medium">
                  {patches.find((p) => p.id === selectedPatchId)?.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {patches.find((p) => p.id === selectedPatchId)?.description}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">配布スケジュール</label>
              <Input
                type="datetime-local"
                value={deploymentDate}
                onChange={(e) => setDeploymentDate(e.target.value)}
              />
              <div className="text-xs text-gray-500">
                指定した日時に自動でパッチがインストールされます。
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">配布対象PC</label>
              <div className="border rounded-md h-48 overflow-y-auto p-2">
                {pcs.map((pc) => (
                  <div
                    key={pc.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                  >
                    <input
                      type="checkbox"
                      id={`pc-${pc.id}`}
                      checked={selectedPCs.includes(pc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPCs([...selectedPCs, pc.id]);
                        } else {
                          setSelectedPCs(
                            selectedPCs.filter((id) => id !== pc.id)
                          );
                        }
                      }}
                      className="rounded text-blue-600"
                    />
                    <label
                      htmlFor={`pc-${pc.id}`}
                      className="flex flex-1 items-center cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center">
                          <Laptop className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          <span className="font-medium">{pc.name}</span>
                          {pc.status === "online" ? (
                            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                          ) : pc.status === "offline" ? (
                            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                          ) : (
                            <span className="ml-2 w-2 h-2 bg-yellow-500 rounded-full"></span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{pc.os}</div>
                      </div>
                      <div className="text-xs text-gray-500 ml-auto">
                        最終更新: {pc.lastUpdate}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>選択: {selectedPCs.length} 台</span>
                <button
                  onClick={() => {
                    if (selectedPCs.length === pcs.length) {
                      setSelectedPCs([]);
                    } else {
                      setSelectedPCs(pcs.map((pc) => pc.id));
                    }
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {selectedPCs.length === pcs.length
                    ? "すべて解除"
                    : "すべて選択"}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeployDialog(false)}
            >
              キャンセル
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleDeployPatch}
              disabled={selectedPCs.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              配布開始
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
