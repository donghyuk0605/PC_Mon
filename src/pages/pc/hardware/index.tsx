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
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "lib/firebase";
import {
  AlertCircle,
  ArrowUpDown,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  CircuitBoard,
  Cpu,
  Edit,
  HardDrive,
  Monitor,
  Mouse,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ハードウェアアイテム型
type HardwareItem = {
  id: string; // Firestore用にstringに変更
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warranty: string;
  status: string;
  assignedTo?: string;
  location?: string;
  specs: Record<string, string>;
};

// PC 型
type PC = {
  id: string;
  name: string;
  status: string;
};

export default function HardwareManagementPage() {
  const [hardwareItems, setHardwareItems] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof HardwareItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pcs, setPcs] = useState<PC[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newHardware, setNewHardware] = useState<Partial<HardwareItem>>({
    name: "",
    type: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    warranty: "12ヶ月",
    status: "active",
    specs: {},
  });

  // データ取得
  const fetchData = async () => {
    setLoading(true);
    try {
      // ハードウェアデータ取得
      const hardwareSnapshot = await getDocs(collection(db, "hardware"));
      const hardwareData = hardwareSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HardwareItem[];

      // PCデータ取得
      const pcsSnapshot = await getDocs(collection(db, "pcs"));
      const pcsData = pcsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PC[];

      setHardwareItems(hardwareData);
      setPcs(pcsData);
      setError("");
    } catch (err) {
      setError("データの読み込みに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ソート処理
  const handleSort = (field: keyof HardwareItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // フィルタリング後のリスト
  const filteredHardware = hardwareItems
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "purchaseDate") {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      const valueA = a[sortField]?.toString().toLowerCase() || "";
      const valueB = b[sortField]?.toString().toLowerCase() || "";

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

  // タイプ別アイコン
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "processor":
        return <Cpu className="h-4 w-4 text-blue-500" />;
      case "memory":
        return <CircuitBoard className="h-4 w-4 text-green-500" />;
      case "storage":
        return <HardDrive className="h-4 w-4 text-purple-500" />;
      case "display":
        return <Monitor className="h-4 w-4 text-amber-500" />;
      case "peripheral":
        return <Mouse className="h-4 w-4 text-gray-500" />;
      default:
        return <HardDrive className="h-4 w-4 text-gray-500" />;
    }
  };

  // ステータスバッジ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">
            <Check className="h-3 w-3 mr-1" /> 使用中
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500">
            <X className="h-3 w-3 mr-1" /> 未使用
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" /> メンテナンス中
          </Badge>
        );
      case "deprecated":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="h-3 w-3 mr-1" /> 廃棄予定
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 追加処理
  const handleAddHardware = async () => {
    try {
      await addDoc(collection(db, "hardware"), {
        ...newHardware,
        createdAt: new Date().toISOString(),
      });

      setShowAddDialog(false);
      setNewHardware({
        name: "",
        type: "",
        manufacturer: "",
        model: "",
        serialNumber: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        warranty: "12ヶ月",
        status: "active",
        specs: {},
      });

      await fetchData(); // データを再取得
    } catch (err) {
      setError("ハードウェアの追加に失敗しました");
      console.error(err);
    }
  };

  // 削除処理
  const handleDeleteHardware = async (id: string) => {
    if (!window.confirm("本当にこのハードウェアを削除しますか？")) return;

    try {
      await deleteDoc(doc(db, "hardware", id));
      await fetchData(); // データを再取得
    } catch (err) {
      setError("削除に失敗しました");
      console.error(err);
    }
  };

  // タイプ統計
  const typeStats = {
    processor: hardwareItems.filter((item) => item.type === "processor").length,
    memory: hardwareItems.filter((item) => item.type === "memory").length,
    storage: hardwareItems.filter((item) => item.type === "storage").length,
    display: hardwareItems.filter((item) => item.type === "display").length,
    peripheral: hardwareItems.filter((item) => item.type === "peripheral")
      .length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <HardDrive className="mr-2 h-7 w-7 text-blue-600" />
            ハードウェア管理
          </h1>
          <p className="text-gray-500 mt-1">
            すべてのハードウェア機器を追跡・管理します
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
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
            ハードウェア追加
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {Object.entries({
            全体: hardwareItems.length,
            プロセッサ: typeStats.processor,
            メモリ: typeStats.memory,
            ディスプレイ: typeStats.display,
            周辺機器: typeStats.peripheral,
          }).map(([label, count]) => (
            <Card key={label} className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}件</div>
                <div className="text-xs text-gray-500 mt-1">登録済み機器</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="md:col-span-4 border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>ハードウェアインベントリ</CardTitle>
                <CardDescription>
                  すべてのハードウェア機器を管理します
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="検索..."
                    className="pl-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="タイプフィルター" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのタイプ</SelectItem>
                      <SelectItem value="processor">プロセッサ</SelectItem>
                      <SelectItem value="memory">メモリ</SelectItem>
                      <SelectItem value="storage">ストレージ</SelectItem>
                      <SelectItem value="display">ディスプレイ</SelectItem>
                      <SelectItem value="peripheral">周辺機器</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="ステータスフィルター" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのステータス</SelectItem>
                      <SelectItem value="active">使用中</SelectItem>
                      <SelectItem value="inactive">未使用</SelectItem>
                      <SelectItem value="maintenance">
                        メンテナンス中
                      </SelectItem>
                      <SelectItem value="deprecated">廃棄予定</SelectItem>
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
                  データを読み込み中...
                </span>
              </div>
            ) : filteredHardware.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">検索結果がありません</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead
                        className="w-[20%] cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          名前
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
                      <TableHead className="w-[10%]">タイプ</TableHead>
                      <TableHead
                        className="w-[15%] cursor-pointer"
                        onClick={() => handleSort("manufacturer")}
                      >
                        <div className="flex items-center">
                          メーカー/モデル
                          {sortField === "manufacturer" ? (
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
                      <TableHead className="w-[15%]">シリアル番号</TableHead>
                      <TableHead
                        className="w-[10%] cursor-pointer"
                        onClick={() => handleSort("purchaseDate")}
                      >
                        <div className="flex items-center">
                          購入日
                          {sortField === "purchaseDate" ? (
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
                      <TableHead className="w-[10%]">ステータス</TableHead>
                      <TableHead className="w-[10%]">割り当てPC</TableHead>
                      <TableHead className="w-[10%] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredHardware.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.location || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getTypeIcon(item.type)}
                            <span className="ml-1 capitalize">
                              {item.type === "processor"
                                ? "プロセッサ"
                                : item.type === "memory"
                                ? "メモリ"
                                : item.type === "storage"
                                ? "ストレージ"
                                : item.type === "display"
                                ? "ディスプレイ"
                                : item.type === "peripheral"
                                ? "周辺機器"
                                : item.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{item.manufacturer}</div>
                          <div className="text-xs text-gray-500">
                            {item.model}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.serialNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarClock className="h-3 w-3 mr-1 text-gray-400" />
                            <span>
                              {new Date(item.purchaseDate).toLocaleDateString(
                                "ja-JP"
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            保証: {item.warranty}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          {item.assignedTo ? (
                            <div className="flex items-center">
                              <Cpu className="h-3 w-3 mr-1 text-gray-500" />
                              <span>{item.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">未割り当て</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/pc/hardware/edit?id=${item.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteHardware(item.id)}
                              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
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
              合計 {filteredHardware.length}件 / 全 {hardwareItems.length}件
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* 追加ダイアログ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-blue-600" />
              新規ハードウェア登録
            </DialogTitle>
            <DialogDescription>
              新しいハードウェアの情報を入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">機器名 *</label>
                <Input
                  placeholder="機器の識別名"
                  value={newHardware.name || ""}
                  onChange={(e) =>
                    setNewHardware({ ...newHardware, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">タイプ *</label>
                <Select
                  value={newHardware.type || ""}
                  onValueChange={(value) =>
                    setNewHardware({ ...newHardware, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="タイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processor">プロセッサ</SelectItem>
                    <SelectItem value="memory">メモリ</SelectItem>
                    <SelectItem value="storage">ストレージ</SelectItem>
                    <SelectItem value="display">ディスプレイ</SelectItem>
                    <SelectItem value="peripheral">周辺機器</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">メーカー *</label>
                <Input
                  placeholder="メーカー名"
                  value={newHardware.manufacturer || ""}
                  onChange={(e) =>
                    setNewHardware({
                      ...newHardware,
                      manufacturer: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">モデル名 *</label>
                <Input
                  placeholder="正確なモデル名"
                  value={newHardware.model || ""}
                  onChange={(e) =>
                    setNewHardware({ ...newHardware, model: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">シリアル番号 *</label>
                <Input
                  placeholder="固有のシリアル番号"
                  value={newHardware.serialNumber || ""}
                  onChange={(e) =>
                    setNewHardware({
                      ...newHardware,
                      serialNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">購入日 *</label>
                <Input
                  type="date"
                  value={newHardware.purchaseDate || ""}
                  onChange={(e) =>
                    setNewHardware({
                      ...newHardware,
                      purchaseDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">保証期間</label>
                <Select
                  value={newHardware.warranty || "12ヶ月"}
                  onValueChange={(value) =>
                    setNewHardware({ ...newHardware, warranty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="保証期間を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12ヶ月">12ヶ月</SelectItem>
                    <SelectItem value="24ヶ月">24ヶ月</SelectItem>
                    <SelectItem value="36ヶ月">36ヶ月</SelectItem>
                    <SelectItem value="48ヶ月">48ヶ月</SelectItem>
                    <SelectItem value="60ヶ月">60ヶ月</SelectItem>
                    <SelectItem value="永久">永久</SelectItem>
                    <SelectItem value="なし">なし</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ステータス</label>
                <Select
                  value={newHardware.status || "active"}
                  onValueChange={(value) =>
                    setNewHardware({ ...newHardware, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">使用中</SelectItem>
                    <SelectItem value="inactive">未使用</SelectItem>
                    <SelectItem value="maintenance">メンテナンス中</SelectItem>
                    <SelectItem value="deprecated">廃棄予定</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">割り当てPC</label>
                <Select
                  value={newHardware.assignedTo || ""}
                  onValueChange={(value) =>
                    setNewHardware({ ...newHardware, assignedTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="PCを選択 (任意)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">未割り当て</SelectItem>
                    {pcs.map((pc) => (
                      <SelectItem key={pc.id} value={pc.name}>
                        <div className="flex items-center">
                          <Cpu className="h-3 w-3 mr-2 text-gray-500" />
                          {pc.name}
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="共用機器">共用機器</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">設置場所</label>
                <Input
                  placeholder="物理的な場所 (任意)"
                  value={newHardware.location || ""}
                  onChange={(e) =>
                    setNewHardware({ ...newHardware, location: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              キャンセル
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddHardware}
              disabled={
                !newHardware.name ||
                !newHardware.type ||
                !newHardware.manufacturer ||
                !newHardware.model ||
                !newHardware.serialNumber ||
                !newHardware.purchaseDate
              }
            >
              <Save className="h-4 w-4 mr-2" />
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
