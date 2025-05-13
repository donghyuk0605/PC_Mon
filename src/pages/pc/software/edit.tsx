// app/pc/software/edit/page.tsx
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "lib/firebase";
import { AlertCircle, ArrowLeft, Box, Loader, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SoftwareFormData = {
  name: string;
  publisher: string;
  version: string;
  type: string;
  category: string;
  licenseType: string;
  purchaseDate: string;
  expiryDate: string;
  cost: number;
  installations: number;
  maxInstallations: number;
  status: string;
  tags: string[];
  notes: string;
};

export default function EditSoftwarePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState<SoftwareFormData>({
    name: "",
    publisher: "",
    version: "",
    type: "",
    category: "",
    licenseType: "",
    purchaseDate: "",
    expiryDate: "",
    cost: 0,
    installations: 0,
    maxInstallations: 1,
    status: "active",
    tags: [],
    notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      router.push("/pc/software");
      return;
    }

    const fetchSoftware = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "software", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || "",
            publisher: data.publisher || "",
            version: data.version || "",
            type: data.type || "",
            category: data.category || "",
            licenseType: data.licenseType || "",
            purchaseDate: data.purchaseDate || "",
            expiryDate: data.expiryDate || "",
            cost: data.cost || 0,
            installations: data.installations || 0,
            maxInstallations: data.maxInstallations || 1,
            status: data.status || "active",
            tags: data.tags || [],
            notes: data.notes || "",
          });
        } else {
          setError("ソフトウェアが見つかりませんでした");
          router.push("/pc/software");
        }
      } catch (err) {
        setError("データの読み込みに失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSoftware();
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
      const docRef = doc(db, "software", id);
      await updateDoc(docRef, {
        ...formData,
        lastUpdated: new Date().toISOString(),
      });
      router.push("/pc/software");
    } catch (err) {
      setError("保存に失敗しました");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
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
          <Link href="/pc/software">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <Box className="mr-2 h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  ソフトウェア情報の編集
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">ソフトウェア名 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="例: Microsoft Office 365"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher">パブリッシャ *</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                    placeholder="例: Microsoft"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">バージョン *</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                    placeholder="例: 2024"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">タイプ *</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="例: オフィスソフト"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category" className="bg-white">
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">
                        オペレーティングシステム
                      </SelectItem>
                      <SelectItem value="productivity">生産性</SelectItem>
                      <SelectItem value="development">開発</SelectItem>
                      <SelectItem value="creative">クリエイティブ</SelectItem>
                      <SelectItem value="engineering">
                        エンジニアリング
                      </SelectItem>
                      <SelectItem value="communication">
                        コミュニケーション
                      </SelectItem>
                      <SelectItem value="security">セキュリティ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseType">ライセンス種別 *</Label>
                  <Select
                    value={formData.licenseType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, licenseType: value })
                    }
                  >
                    <SelectTrigger id="licenseType" className="bg-white">
                      <SelectValue placeholder="ライセンス種別を選択" />
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

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">購入日</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">期限日</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">コスト (₩)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: Number(e.target.value) })
                    }
                    placeholder="0"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxInstallations">最大インストール数</Label>
                  <Input
                    id="maxInstallations"
                    type="number"
                    value={formData.maxInstallations || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxInstallations: Number(e.target.value),
                      })
                    }
                    placeholder="1"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installations">現在のインストール数</Label>
                  <Input
                    id="installations"
                    type="number"
                    value={formData.installations || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        installations: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                    className="bg-white"
                  />
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
                      <SelectItem value="active">有効</SelectItem>
                      <SelectItem value="inactive">無効</SelectItem>
                      <SelectItem value="expiring-soon">
                        まもなく期限切れ
                      </SelectItem>
                      <SelectItem value="expired">期限切れ</SelectItem>
                      <SelectItem value="update-required">更新必要</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>タグ</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="タグを入力してEnterキー"
                      className="bg-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                    >
                      追加
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">メモ</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="追加メモ"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    saving ||
                    !id ||
                    !formData.name ||
                    !formData.publisher ||
                    !formData.version ||
                    !formData.type ||
                    !formData.category ||
                    !formData.licenseType
                  }
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
                <Link href="/pc/software">
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
