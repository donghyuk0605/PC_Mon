"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "lib/firebase";
import {
  AlertCircle,
  ArrowLeft,
  Cpu,
  HardDrive,
  Loader,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type HardwareFormData = {
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warranty: string;
  status: string;
  assignedTo: string;
  location: string;
  specs: Record<string, string>;
};

type PC = {
  id: string;
  name: string;
  status: string;
};

export default function EditHardwarePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState<HardwareFormData>({
    name: "",
    type: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warranty: "12ヶ月",
    status: "active",
    assignedTo: "",
    location: "",
    specs: {},
  });
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pcs, setPcs] = useState<PC[]>([]);

  useEffect(() => {
    if (!id) {
      router.push("/pc/hardware");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // ハードウェアデータを取得
        const docRef = doc(db, "hardware", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || "",
            type: data.type || "",
            manufacturer: data.manufacturer || "",
            model: data.model || "",
            serialNumber: data.serialNumber || "",
            purchaseDate: data.purchaseDate || "",
            warranty: data.warranty || "12ヶ月",
            status: data.status || "active",
            assignedTo: data.assignedTo || "",
            location: data.location || "",
            specs: data.specs || {},
          });
        } else {
          setError("ハードウェアが見つかりませんでした");
          router.push("/pc/hardware");
        }

        // PCデータを取得
        const pcsSnapshot = await getDocs(collection(db, "pcs"));
        const pcsData = pcsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PC[];
        setPcs(pcsData);
      } catch (err) {
        setError("データの読み込みに失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!id) {
      setError("IDが指定されていません");
      return;
    }

    try {
      const docRef = doc(db, "hardware", id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      router.push("/pc/hardware");
    } catch (err) {
      setError("保存に失敗しました");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSpec = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specs: {
          ...formData.specs,
          [specKey]: specValue,
        },
      });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData({ ...formData, specs: newSpecs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/pc/hardware">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <HardDrive className="mr-2 h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  ハードウェア情報の編集
                </CardTitle>
                <CardDescription className="mt-1 text-gray-600">
                  ID: {id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">機器名 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="例: 開発チーム CPU"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">タイプ *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger id="type" className="bg-white">
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

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">メーカー *</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    placeholder="例: Intel"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">モデル *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="例: Core i7-12700K"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">シリアル番号 *</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    placeholder="例: INTL7894561230"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">購入日 *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">保証期間</Label>
                  <Select
                    value={formData.warranty}
                    onValueChange={(value) =>
                      setFormData({ ...formData, warranty: value })
                    }
                  >
                    <SelectTrigger id="warranty" className="bg-white">
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
                  <Label htmlFor="status">ステータス *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status" className="bg-white">
                      <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">使用中</SelectItem>
                      <SelectItem value="inactive">未使用</SelectItem>
                      <SelectItem value="maintenance">
                        メンテナンス中
                      </SelectItem>
                      <SelectItem value="deprecated">廃棄予定</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">割り当てPC</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, assignedTo: value })
                    }
                  >
                    <SelectTrigger id="assignedTo" className="bg-white">
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
                  <Label htmlFor="location">設置場所</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="例: ソウル本社 開発チーム"
                    className="bg-white"
                  />
                </div>
              </div>

              {/* スペック */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">スペック</h3>

                {/* 既存のスペック */}
                {Object.entries(formData.specs).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(formData.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSpec(key)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 新しいスペック追加 */}
                <div className="flex gap-2">
                  <Input
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="項目名 (例: cores)"
                    className="bg-white"
                  />
                  <Input
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="値 (例: 12)"
                    className="bg-white"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSpec}
                    variant="outline"
                    disabled={!specKey || !specValue}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 操作ボタン */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving || !id}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </>
                  )}
                </Button>
                <Link href="/pc/hardware">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
