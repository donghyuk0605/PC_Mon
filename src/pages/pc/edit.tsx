// components/EditPcPage.tsx
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "lib/firebase";
import { AlertCircle, ArrowLeft, HardDrive, Loader, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type PcFormData = {
  name: string;
  status: string;
  assignedUser: string;
  lastActive: string;
};

export default function EditPcPage() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<PcFormData>({
    name: "",
    status: "active",
    assignedUser: "",
    lastActive: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchPc = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "pcs", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || "",
            status: data.status || "active",
            assignedUser: data.assignedUser || "",
            lastActive: data.lastActive || new Date().toISOString(),
          });
        } else {
          setError("PCが見つかりませんでした");
        }
      } catch (err) {
        setError("データの読み込みに失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPc();
  }, [router.isReady, id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("IDが指定されていません");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const docRef = doc(db, "pcs", id as string);
      await updateDoc(docRef, {
        ...formData,
        lastActive: new Date().toISOString(),
      });
      router.push("/pc");
    } catch (err) {
      setError("保存に失敗しました");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/pc">
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
                  PC情報の編集
                </CardTitle>
                <CardDescription className="mt-1 text-gray-600">
                  {id ? `ID: ${id}` : "IDが不明です"}
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
              <div className="space-y-2">
                <Label htmlFor="name">PC名 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="例: PC-001"
                  required
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
                    <SelectItem value="maintenance">メンテナンス</SelectItem>
                    <SelectItem value="error">エラー</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedUser">担当者</Label>
                <Input
                  id="assignedUser"
                  value={formData.assignedUser}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedUser: e.target.value })
                  }
                  placeholder="例: 田中太郎"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastActive">最終アクティブ日時</Label>
                <Input
                  id="lastActive"
                  type="datetime-local"
                  value={formData.lastActive.slice(0, -1)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastActive: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="bg-white"
                />
              </div>

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
                <Link href="/pc">
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
