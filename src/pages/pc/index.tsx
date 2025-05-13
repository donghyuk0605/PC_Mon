"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "lib/firebase";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  HardDrive,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type PcItem = {
  id: number;
  name: string;
  status: string;
  assignedUser?: string;
  lastActive: string;
};

export default function PcPage() {
  const [pcs, setPcs] = useState<PcItem[]>([]);
  const [filteredPcs, setFilteredPcs] = useState<PcItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "pcs"));
      const data = querySnapshot.docs.map((doc, index) => ({
        id: doc.id, // Firestore 문서 ID
        ...doc.data(),
      })) as unknown as PcItem[];

      setPcs(data);
      setFilteredPcs(data);
      setError("");
    } catch (err) {
      setError("❌ Firestoreからの取得に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let results = pcs;
    if (searchTerm) {
      results = results.filter(
        (pc) =>
          pc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pc.assignedUser &&
            pc.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter !== "all") {
      results = results.filter((pc) => pc.status === statusFilter);
    }
    setFilteredPcs(results);
  }, [searchTerm, statusFilter, pcs]);

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？この操作は元に戻せません。")) return;
    try {
      await deleteDoc(doc(db, "pcs", id));
      fetchData(); // 삭제 후 목록 새로고침
    } catch (err) {
      setError("❌ Firestore からの削除に失敗しました");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "有効":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" /> 有効
          </Badge>
        );
      case "inactive":
      case "無効":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <XCircle className="w-3 h-3 mr-1" /> 無効
          </Badge>
        );
      case "maintenance":
      case "メンテナンス":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" /> メンテナンス
          </Badge>
        );
      case "error":
      case "エラー":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertCircle className="w-3 h-3 mr-1" /> エラー
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
        );
    }
  };

  return (
    <div className="p-8">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <HardDrive className="mr-2 h-6 w-6 text-blue-600" />
                PCインベントリ管理
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600">
                すべてのPC資産を管理・追跡します
              </CardDescription>
            </div>
            <Link href="/pc/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> 新しいPCを登録
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー発生</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="PC名またはユーザーで検索..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="ステータスで絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのステータス</SelectItem>
                  <SelectItem value="active">有効</SelectItem>
                  <SelectItem value="inactive">無効</SelectItem>
                  <SelectItem value="maintenance">メンテナンス</SelectItem>
                  <SelectItem value="error">エラー</SelectItem>
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchData}
                      className="bg-white"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>更新</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-[80px] font-medium">ID</TableHead>
                  <TableHead className="font-medium">名前</TableHead>
                  <TableHead className="font-medium">ステータス</TableHead>
                  <TableHead className="font-medium">担当者</TableHead>
                  <TableHead className="font-medium">最終アクティブ</TableHead>
                  <TableHead className="text-right font-medium w-[150px]">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                        <p>データを読み込み中...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPcs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      検索結果がありません
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPcs.map((pc) => (
                    <TableRow key={pc.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{pc.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{pc.name}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(pc.status)}</TableCell>
                      <TableCell>
                        {pc.assignedUser ? (
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
                              {pc.assignedUser.charAt(0).toUpperCase()}
                            </div>
                            {pc.assignedUser}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {new Date(pc.lastActive).toLocaleString("ja-JP", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Link href={`/pc/edit?id=${pc.id}`}>
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
                          onClick={() => handleDelete(pc.id)}
                          className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {filteredPcs.length > 0
              ? `合計 ${filteredPcs.length} 台のPC資産があります`
              : ""}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
