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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "lib/firebase";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Cpu,
  HardDrive,
  Info,
  PlusCircle,
  Save,
  Server,
  Smartphone,
  Trash,
  User,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NewPcData = {
  name: string;
  status: string;
  assignedUser: string;
  ipAddress: string;
  osType: string;
  department: string;
  notes: string;
  type: string;
  lastActive: string;
};

type UserOption = {
  id: string;
  name: string;
  username: string;
};

export default function CreatePcPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewPcData>({
    name: "",
    status: "online",
    assignedUser: "",
    ipAddress: "",
    osType: "",
    department: "",
    notes: "",
    type: "",
    lastActive: new Date().toISOString(),
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);

  const [errors, setErrors] = useState({
    name: false,
    status: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          username: data.username,
        };
      });
      setUserOptions(users);
    };

    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      status: !formData.status,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "pcs"), formData);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/pc");
      }, 1500);
    } catch (err) {
      console.error("Firestore 登録エラー:", err);
      setError("❌ 登録に失敗しました。サーバーエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      status: "online",
      assignedUser: "",
      ipAddress: "",
      osType: "",
      department: "",
      notes: "",
      type: "",
      lastActive: new Date().toISOString(),
    });
    setErrors({
      name: false,
      status: false,
    });
  };

  const handleInputChange = (field: keyof NewPcData, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (field === "name" || field === "status") {
      setErrors({ ...errors, [field]: !value });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/pc">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center">
          <PlusCircle className="mr-2 h-6 w-6 text-blue-600" />
          新しいPCを登録
        </h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <div className="font-medium">エラー</div>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div className="font-medium">登録完了</div>
          <AlertDescription>
            新しいPCが正常に登録されました。リストに移動します。
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Info className="h-4 w-4" />
          <span>※は必須項目です</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">上級モード</span>
          <Switch checked={advancedMode} onCheckedChange={setAdvancedMode} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl flex items-center">
              <HardDrive className="mr-2 h-5 w-5 text-blue-600" />
              基本情報
            </CardTitle>
            <CardDescription>PCの基本情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={errors.name ? "text-red-500" : ""}
              >
                PC名 ※
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="PC名を入力してください"
                className={
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {errors.name && (
                <p className="text-sm text-red-500">PC名は必須項目です。</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className={errors.status ? "text-red-500" : ""}
              >
                ステータス ※
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger
                  id="status"
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="PCステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 mr-2 text-green-500" />
                      オンライン
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center">
                      <WifiOff className="h-4 w-4 mr-2 text-red-500" />
                      オフライン
                    </div>
                  </SelectItem>
                  <SelectItem value="maintenance">
                    <div className="flex items-center">
                      <Wrench className="h-4 w-4 mr-2 text-yellow-500" />
                      メンテナンス中
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">
                  ステータスは必須項目です。
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">PC種別</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="PC種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      デスクトップ
                    </div>
                  </SelectItem>
                  <SelectItem value="laptop">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      ノートパソコン
                    </div>
                  </SelectItem>
                  <SelectItem value="server">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      サーバー
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipAddress">IPアドレス</Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress}
                onChange={(e) => handleInputChange("ipAddress", e.target.value)}
                placeholder="例: 192.168.1.100"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              管理情報
            </CardTitle>
            <CardDescription>
              担当者と部署情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignedUser">担当者</Label>
              <Select
                value={formData.assignedUser}
                onValueChange={(value) =>
                  handleInputChange("assignedUser", value)
                }
              >
                <SelectTrigger id="assignedUser">
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} (@{user.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">部署</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                placeholder="部署名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="osType">OS（オペレーティングシステム）</Label>
              <Input
                id="osType"
                value={formData.osType}
                onChange={(e) => handleInputChange("osType", e.target.value)}
                placeholder="例: Windows 11 Pro"
              />
            </div>
          </CardContent>
        </Card>

        {advancedMode && (
          <Card className="border border-gray-200 shadow-sm md:col-span-2">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl">メモ</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="このPCに関するメモを入力してください"
                className="min-h-32"
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2 text-gray-600"
        >
          <Trash className="h-4 w-4" />
          リセット
        </Button>

        <div className="space-x-2">
          <Link href="/pc">
            <Button variant="outline">キャンセル</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                登録中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                PCを登録
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
