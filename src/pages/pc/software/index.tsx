/*  ==============================
    src/pages/pc/software/index.tsx
    ============================== */

"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "lib/firebase";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* ---------- UI 컴포넌트 ---------- */
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

/* ---------- 아이콘 ---------- */
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  BarChart,
  Box,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Code,
  Edit,
  FileBarChart,
  Info,
  Layers,
  Monitor,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  Trash,
  Users,
  X,
} from "lucide-react";

/* ---------- 타입 ---------- */
type Software = {
  id: string;
  name: string;
  publisher: string;
  version: string;
  type: string;
  category: string;
  licenseType: string;
  purchaseDate?: string;
  expiryDate?: string;
  cost?: number;
  installations: number;
  maxInstallations?: number;
  status:
    | "active"
    | "inactive"
    | "expiring-soon"
    | "expired"
    | "update-required";
  lastUpdated?: string;
  tags?: string[];
  notes?: string;
};

type PC = {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
};

type LicenseUsage = {
  id: string;
  softwareId: string;
  softwareName: string;
  pcId: string;
  pcName: string;
  installDate: string;
  lastUsed: string;
  status: "active" | "update-required";
  version: string;
};

/* ---------- 유틸(아이콘·뱃지) ---------- */
const categoryIcon = (cat: string) => {
  switch (cat) {
    case "system":
      return <Monitor className="h-4 w-4 text-blue-500" />;
    case "productivity":
      return <FileBarChart className="h-4 w-4 text-green-500" />;
    case "development":
      return <Code className="h-4 w-4 text-purple-500" />;
    case "creative":
      return <Pencil className="h-4 w-4 text-amber-500" />;
    case "engineering":
      return <Layers className="h-4 w-4 text-indigo-500" />;
    case "communication":
      return <Users className="h-4 w-4 text-pink-500" />;
    case "security":
      return <Shield className="h-4 w-4 text-red-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const statusBadge = (st: Software["status"]) => {
  switch (st) {
    case "active":
      return (
        <Badge className="bg-green-500">
          <Check className="h-3 w-3 mr-1" />
          有効
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-gray-500">
          <X className="h-3 w-3 mr-1" />
          無効
        </Badge>
      );
    case "expiring-soon":
      return (
        <Badge className="bg-yellow-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          まもなく期限
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-red-500">
          <AlertTriangle className="h-3 w-3 mr-1" />
          期限切れ
        </Badge>
      );
    case "update-required":
      return (
        <Badge className="bg-blue-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          更新必要
        </Badge>
      );
  }
};

/* ===============================
   메인 컴포넌트
   =============================== */
export default function SoftwarePage() {
  /* ---------- 상태 ---------- */
  const [software, setSoftware] = useState<Software[]>([]);
  const [pcs, setPcs] = useState<PC[]>([]);
  const [usage, setUsage] = useState<LicenseUsage[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [catFilt, setCatFilt] = useState("all");
  const [licFilt, setLicFilt] = useState("all");
  const [statFilt, setStatFilt] = useState("all");

  const [sortKey, setSortKey] = useState<keyof Software>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [tab, setTab] = useState("inventory");

  const [dlgOpen, setDlgOpen] = useState(false);
  const [newSW, setNewSW] = useState<Partial<Software>>({
    name: "",
    publisher: "",
    licenseType: "無料",
    installations: 0,
  });

  /* ---------- 데이터 로딩 ---------- */
  async function loadData() {
    setLoading(true);
    try {
      const swSnap = await getDocs(collection(db, "software"));
      setSoftware(
        swSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Software))
      );

      const pcSnap = await getDocs(collection(db, "pcs"));
      setPcs(pcSnap.docs.map((d) => ({ id: d.id, ...d.data() } as PC)));

      const usSnap = await getDocs(collection(db, "license_usage"));
      setUsage(
        usSnap.docs.map((d) => ({ id: d.id, ...d.data() } as LicenseUsage))
      );

      setError("");
    } catch (e) {
      console.error(e);
      setError("データ取得に失敗しました");
    }
    setLoading(false);
  }
  useEffect(() => {
    loadData();
  }, []);

  /* ---------- 필터 & 정렬 ---------- */
  const filtered = useMemo(() => {
    let list = [...software];

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(s) ||
          v.publisher.toLowerCase().includes(s) ||
          v.version.toLowerCase().includes(s) ||
          (v.tags && v.tags.some((t) => t.toLowerCase().includes(s)))
      );
    }
    if (catFilt !== "all") list = list.filter((v) => v.category === catFilt);
    if (licFilt !== "all") list = list.filter((v) => v.licenseType === licFilt);
    if (statFilt !== "all") list = list.filter((v) => v.status === statFilt);

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const aa = a[sortKey];
      const bb = b[sortKey];

      /* 날짜 */
      if (
        sortKey === "purchaseDate" ||
        sortKey === "expiryDate" ||
        sortKey === "lastUpdated"
      ) {
        return dir * (+new Date(aa || "") - +new Date(bb || ""));
      }
      /* 숫자 */
      if (
        sortKey === "installations" ||
        sortKey === "maxInstallations" ||
        sortKey === "cost"
      ) {
        return dir * ((Number(aa) || 0) - (Number(bb) || 0));
      }
      /* 문자열 */
      return dir * aa?.toString().localeCompare(bb?.toString());
    });

    return list;
  }, [software, search, catFilt, licFilt, statFilt, sortKey, sortDir]);

  /* ---------- CRUD ---------- */
  async function addSoftware() {
    if (!newSW.name || !newSW.publisher) {
      setError("名前とパブリッシャは必須です");
      return;
    }
    try {
      await addDoc(collection(db, "software"), {
        ...newSW,
        status: "active",
        lastUpdated: new Date().toISOString(),
      });
      setDlgOpen(false);
      setNewSW({
        name: "",
        publisher: "",
        licenseType: "無料",
        installations: 0,
      });
      await loadData();
    } catch (e) {
      console.error(e);
      setError("追加に失敗しました");
    }
  }

  async function deleteSoftware(id: string) {
    if (!confirm("本当に削除しますか？")) return;
    try {
      await deleteDoc(doc(db, "software", id));
      loadData();
    } catch (e) {
      console.error(e);
      setError("削除に失敗しました");
    }
  }

  /* ---------- 통계 ---------- */
  const totalInstalls = useMemo(
    () => software.reduce((sum, v) => sum + v.installations, 0),
    [software]
  );

  const licenseStats = useMemo(() => {
    return software.reduce((acc: Record<string, number>, v) => {
      acc[v.licenseType] = (acc[v.licenseType] || 0) + 1;
      return acc;
    }, {});
  }, [software]);

  const publisherStats = useMemo(() => {
    return software.reduce((acc: Record<string, number>, v) => {
      acc[v.publisher] = (acc[v.publisher] || 0) + 1;
      return acc;
    }, {});
  }, [software]);

  /* ---------- JSX ---------- */
  return (
    <div className="p-6 space-y-6">
      {/* ===== 헤더 ===== */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Box className="h-7 w-7 mr-2 text-blue-600" />
            ソフトウェア管理
          </h1>
          <p className="text-gray-500">在庫とライセンスを一元管理</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
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
            onClick={() => setDlgOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            ソフトウェア追加
          </Button>
        </div>
      </div>

      {/* ===== 에러 표시 ===== */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ===== 주요 통계 카드 ===== */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>登録ソフトウェア</CardTitle>
          </CardHeader>
          <CardContent>{software.length} 件</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>有料ライセンス</CardTitle>
          </CardHeader>
          <CardContent>
            {software.filter((v) => v.licenseType !== "無料").length} 件
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>期限切れ間近</CardTitle>
          </CardHeader>
          <CardContent>
            {software.filter((v) => v.status === "expiring-soon").length} 件
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>総インストール</CardTitle>
          </CardHeader>
          <CardContent>{totalInstalls} 件</CardContent>
        </Card>
      </div>

      {/* ===== 탭 ===== */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="inventory" className="flex items-center gap-1">
            <Package className="h-4 w-4" /> 在庫
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-1">
            <ClipboardCheck className="h-4 w-4" /> ライセンス
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" /> 使用状況
          </TabsTrigger>
        </TabsList>

        {/* -------- 在庫 탭 -------- */}
        <TabsContent value="inventory">
          {/* 검색 & 필터 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-9 w-56"
                placeholder="検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={catFilt} onValueChange={setCatFilt}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="system">OS</SelectItem>
                <SelectItem value="productivity">生産性</SelectItem>
                <SelectItem value="development">開発</SelectItem>
                <SelectItem value="creative">クリエイティブ</SelectItem>
                <SelectItem value="engineering">エンジニアリング</SelectItem>
                <SelectItem value="communication">
                  コミュニケーション
                </SelectItem>
                <SelectItem value="security">セキュリティ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={licFilt} onValueChange={setLicFilt}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ライセンス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="無料">無料</SelectItem>
                <SelectItem value="サブスクリプション">
                  サブスクリプション
                </SelectItem>
                <SelectItem value="永久">永久</SelectItem>
                <SelectItem value="ボリュームライセンス">
                  ボリュームライセンス
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => {
                      sortKey === "name"
                        ? setSortDir(sortDir === "asc" ? "desc" : "asc")
                        : setSortKey("name");
                    }}
                  >
                    ソフトウェア{" "}
                    {sortKey === "name" ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="inline h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="inline h-4 w-4 opacity-50" />
                    )}
                  </TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead>ライセンス</TableHead>
                  <TableHead>期限</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => {
                      sortKey === "installations"
                        ? setSortDir(sortDir === "asc" ? "desc" : "asc")
                        : setSortKey("installations");
                    }}
                  >
                    インストール
                  </TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead>タグ</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <RefreshCw className="h-5 w-5 animate-spin inline mr-1" />
                      読み込み中...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-gray-500"
                    >
                      該当データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((v) => (
                    <TableRow key={v.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{v.name}</div>
                        <div className="text-xs text-gray-500">
                          {v.publisher} / {v.version}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {categoryIcon(v.category)}
                          <span className="ml-1">{v.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{v.licenseType}</Badge>
                        {v.cost && (
                          <div className="text-xs text-gray-500">
                            {v.cost.toLocaleString()}₩
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {v.expiryDate
                          ? "～" + new Date(v.expiryDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          {v.installations}
                          {v.maxInstallations && ` / ${v.maxInstallations}`}
                        </div>
                        {v.maxInstallations && (
                          <Progress
                            className="h-1 mt-1"
                            value={(v.installations / v.maxInstallations) * 100}
                          />
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(v.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {v.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/pc/software/edit?id=${v.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => deleteSoftware(v.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 푸터 */}
          <CardFooter className="justify-between text-sm text-gray-500 mt-2">
            合計 {filtered.length} 件 / 全 {software.length} 件
          </CardFooter>
        </TabsContent>

        {/* -------- ライセンス 탭 -------- */}
        <TabsContent value="licenses" className="space-y-6">
          {/* 라이선스 종합 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">ライセンス種別要約</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(licenseStats).map(([type, count]) => (
                <div
                  key={type}
                  className="flex justify-between border-b last:border-none py-1"
                >
                  <span className="flex items-center gap-2">
                    <Badge variant="outline">{type}</Badge>
                  </span>
                  <span>{count} 件</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 期限切れ間近 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                期限切れ間近ライセンス
              </CardTitle>
              <CardDescription>今後90日以内に期限切れのもの</CardDescription>
            </CardHeader>
            <CardContent>
              {software.filter((sw) => sw.status === "expiring-soon").length ===
              0 ? (
                <div className="text-center text-gray-500 py-6">
                  <Check className="inline h-6 w-6 text-green-500 mr-1" />
                  期限切れ間近のライセンスはありません
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ソフトウェア</TableHead>
                      <TableHead>期限日</TableHead>
                      <TableHead>残り日数</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {software
                      .filter((sw) => sw.status === "expiring-soon")
                      .map((sw) => {
                        const exp = new Date(sw.expiryDate!);
                        const daysLeft = Math.ceil(
                          (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <TableRow key={sw.id}>
                            <TableCell>
                              <div className="font-medium">{sw.name}</div>
                              <div className="text-xs text-gray-500">
                                {sw.publisher}
                              </div>
                            </TableCell>
                            <TableCell>{exp.toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  daysLeft < 30 ? "destructive" : "outline"
                                }
                              >
                                残り {daysLeft} 日
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* パブリッシャ統計 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                パブリッシャ別ライセンス状況
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>パブリッシャ</TableHead>
                    <TableHead>ソフトウェア数</TableHead>
                    <TableHead>ライセンス種別</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(publisherStats).map(([pub, cnt]) => {
                    const types = Array.from(
                      new Set(
                        software
                          .filter((s) => s.publisher === pub)
                          .map((s) => s.licenseType)
                      )
                    );
                    return (
                      <TableRow key={pub}>
                        <TableCell className="font-medium">{pub}</TableCell>
                        <TableCell>{cnt}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {types.map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-xs"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------- 사용状況 탭 -------- */}
        <TabsContent value="usage" className="space-y-6">
          {/* 라이선스 사용률 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-500" />
                ライセンス使用率
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {software.filter((s) => s.maxInstallations).length === 0 ? (
                <p className="text-center text-gray-500">
                  <Info className="inline h-4 w-4 mr-1" />
                  使用データがありません
                </p>
              ) : (
                software
                  .filter((s) => s.maxInstallations)
                  .map((s) => {
                    const used = usage.filter(
                      (u) => u.softwareId === s.id
                    ).length;
                    const pct = (used / (s.maxInstallations || 1)) * 100;
                    return (
                      <div key={s.id}>
                        <div className="flex justify-between mb-1">
                          <span>{s.name}</span>
                          <span className="text-sm">
                            {used}/{s.maxInstallations}
                          </span>
                        </div>
                        <Progress
                          className="h-2"
                          value={pct}
                          indicatorClassName={
                            pct > 90
                              ? "bg-red-500"
                              : pct > 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        />
                        {pct > 90 && (
                          <div className="text-xs text-red-500 flex items-center mt-0.5">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            ライセンス不足の恐れ
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>

          {/* PC별 인스톨 소프트웨어 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>PC別インストールソフト</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={pcs[0]?.id || ""} className="w-full">
                <TabsList className="mb-4 overflow-x-auto whitespace-nowrap">
                  {pcs.map((pc) => (
                    <TabsTrigger
                      key={pc.id}
                      value={pc.id}
                      className="flex-shrink-0"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            pc.status === "online"
                              ? "bg-green-500"
                              : pc.status === "offline"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        {pc.name}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {pcs.map((pc) => (
                  <TabsContent key={pc.id} value={pc.id}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ソフトウェア</TableHead>
                          <TableHead>インストール日</TableHead>
                          <TableHead>バージョン</TableHead>
                          <TableHead>最終使用</TableHead>
                          <TableHead>状態</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usage.filter((u) => u.pcId === pc.id).length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-6 text-gray-500"
                            >
                              このPCにインストールされたソフトウェアはありません
                            </TableCell>
                          </TableRow>
                        ) : (
                          usage
                            .filter((u) => u.pcId === pc.id)
                            .map((u) => (
                              <TableRow key={u.id}>
                                <TableCell className="font-medium">
                                  {u.softwareName}
                                </TableCell>
                                <TableCell>
                                  {new Date(u.installDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{u.version}</TableCell>
                                <TableCell>
                                  {new Date(u.lastUsed).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {statusBadge(u.status as Software["status"])}
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== 추가 다이얼로그 ===== */}
      <Dialog open={dlgOpen} onOpenChange={setDlgOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              新規ソフトウェア登録
            </DialogTitle>
            <DialogDescription>
              必須項目をすべて入力してください。
            </DialogDescription>
          </DialogHeader>

          {/* 입력 폼 */}
          <div className="grid gap-4 py-4">
            {/* 이름 & 퍼블리셔 */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="ソフトウェア名*"
                value={newSW.name || ""}
                onChange={(e) => setNewSW({ ...newSW, name: e.target.value })}
              />
              <Input
                placeholder="パブリッシャ*"
                value={newSW.publisher || ""}
                onChange={(e) =>
                  setNewSW({ ...newSW, publisher: e.target.value })
                }
              />
            </div>

            {/* 버전 & 타입 */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="バージョン"
                value={newSW.version || ""}
                onChange={(e) =>
                  setNewSW({ ...newSW, version: e.target.value })
                }
              />
              <Input
                placeholder="タイプ"
                value={newSW.type || ""}
                onChange={(e) => setNewSW({ ...newSW, type: e.target.value })}
              />
            </div>

            {/* 카테고리 & 라이선스 */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newSW.category || ""}
                onValueChange={(v) => setNewSW({ ...newSW, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">OS</SelectItem>
                  <SelectItem value="productivity">生産性</SelectItem>
                  <SelectItem value="development">開発</SelectItem>
                  <SelectItem value="creative">クリエイティブ</SelectItem>
                  <SelectItem value="engineering">エンジニアリング</SelectItem>
                  <SelectItem value="communication">
                    コミュニケーション
                  </SelectItem>
                  <SelectItem value="security">セキュリティ</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newSW.licenseType || "無料"}
                onValueChange={(v) => setNewSW({ ...newSW, licenseType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ライセンス種別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="無料">無料</SelectItem>
                  <SelectItem value="サブスクリプション">
                    サブスクリプション
                  </SelectItem>
                  <SelectItem value="永久">永久</SelectItem>
                  <SelectItem value="ボリュームライセンス">
                    ボリュームライセンス
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 인스톨 수 */}
            <Input
              type="number"
              placeholder="インストール数"
              value={newSW.installations || 0}
              onChange={(e) =>
                setNewSW({ ...newSW, installations: Number(e.target.value) })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDlgOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={addSoftware}>
              <Save className="h-4 w-4 mr-2" />
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
