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
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  Info,
  Key,
  LucideIcon,
  Package,
  RefreshCw,
  Save,
  Settings,
  Shield,
  User,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// ユーザー型定義
type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  department: string;
  position: string;
  role: string;
  status: string;
  lastLogin?: string;
  dateCreated: string;
  permissions?: string[];
};

// 権限グループ型定義
type PermissionGroup = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  permissions: Permission[];
};

// 権限型定義
type Permission = {
  id: string;
  name: string;
  description: string;
  default: string[]; // デフォルトでこの権限が付与されるロール
};

// ユーザー権限設定ページ
export default function UserPermissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // 状態管理
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("user_permissions");
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    []
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rolePresetChanged, setRolePresetChanged] = useState(false);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 実際にはAPI呼び出しに置き換え
        setTimeout(() => {
          // 権限グループ & 権限リスト
          const mockPermissionGroups: PermissionGroup[] = [
            {
              id: "system",
              name: "システム管理",
              description: "システム設定および管理機能",
              icon: Settings,
              permissions: [
                {
                  id: "system_settings",
                  name: "システム設定",
                  description: "システム設定変更権限",
                  default: ["admin"],
                },
                {
                  id: "system_logs",
                  name: "システムログ閲覧",
                  description: "システムログ閲覧権限",
                  default: ["admin", "manager"],
                },
                {
                  id: "system_backup",
                  name: "バックアップ/復元",
                  description: "バックアップおよび復元権限",
                  default: ["admin"],
                },
              ],
            },
            {
              id: "user",
              name: "ユーザー管理",
              description: "ユーザーアカウントおよび権限管理",
              icon: Users,
              permissions: [
                {
                  id: "user_management",
                  name: "ユーザー管理",
                  description: "ユーザー作成/編集/削除権限",
                  default: ["admin"],
                },
                {
                  id: "user_view",
                  name: "ユーザー閲覧",
                  description: "ユーザー一覧および情報閲覧権限",
                  default: ["admin", "manager"],
                },
                {
                  id: "role_management",
                  name: "ロール管理",
                  description: "ユーザー権限設定権限",
                  default: ["admin"],
                },
              ],
            },
            {
              id: "hardware",
              name: "ハードウェア管理",
              description: "ハードウェア資産管理",
              icon: Cpu,
              permissions: [
                {
                  id: "hardware_management",
                  name: "ハードウェア管理",
                  description: "ハードウェア登録/編集/削除権限",
                  default: ["admin", "manager"],
                },
                {
                  id: "hardware_view",
                  name: "ハードウェア閲覧",
                  description: "ハードウェア一覧および情報閲覧権限",
                  default: ["admin", "manager", "user"],
                },
              ],
            },
            {
              id: "software",
              name: "ソフトウェア管理",
              description: "ソフトウェアおよびライセンス管理",
              icon: Package,
              permissions: [
                {
                  id: "software_management",
                  name: "ソフトウェア管理",
                  description: "ソフトウェア登録/編集/削除権限",
                  default: ["admin", "manager"],
                },
                {
                  id: "software_view",
                  name: "ソフトウェア閲覧",
                  description: "ソフトウェア一覧および情報閲覧権限",
                  default: ["admin", "manager", "user"],
                },
                {
                  id: "license_management",
                  name: "ライセンス管理",
                  description: "ライセンス登録/編集/削除権限",
                  default: ["admin", "manager"],
                },
              ],
            },
            {
              id: "security",
              name: "セキュリティ管理",
              description: "セキュリティ関連機能",
              icon: Shield,
              permissions: [
                {
                  id: "security_management",
                  name: "セキュリティ管理",
                  description: "セキュリティ設定管理権限",
                  default: ["admin"],
                },
                {
                  id: "patch_management",
                  name: "パッチ管理",
                  description: "パッチ配布管理権限",
                  default: ["admin", "manager"],
                },
                {
                  id: "vulnerability_view",
                  name: "脆弱性閲覧",
                  description: "脆弱性一覧および情報閲覧権限",
                  default: ["admin", "manager", "user"],
                },
              ],
            },
            {
              id: "reports",
              name: "レポート",
              description: "レポート生成および閲覧",
              icon: FileText,
              permissions: [
                {
                  id: "reports_generate",
                  name: "レポート生成",
                  description: "レポート生成権限",
                  default: ["admin", "manager"],
                },
                {
                  id: "reports_view",
                  name: "レポート閲覧",
                  description: "レポート閲覧権限",
                  default: ["admin", "manager", "user"],
                },
                {
                  id: "reports_export",
                  name: "レポート出力",
                  description: "レポート出力権限",
                  default: ["admin", "manager"],
                },
              ],
            },
          ];

          // ユーザー情報サンプル
          const mockUser: User = {
            id: Number(userId) || 1,
            name: "김철수",
            username: "cslee",
            email: "cslee@pcmon.com",
            department: "開発部",
            position: "シニア開発者",
            role: "user",
            status: "active",
            lastLogin: "2024-05-10 11:22:33",
            dateCreated: "2023-03-20",
            permissions: [
              "hardware_view",
              "software_view",
              "vulnerability_view",
              "reports_view",
            ],
          };

          setPermissionGroups(mockPermissionGroups);
          setUser(mockUser);
          setSelectedPermissions(mockUser.permissions || []);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("データ読み込み中のエラー:", err);
        setError("ユーザー情報の取得に失敗しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ロールバッジレンダリング
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <Key className="h-3 w-3 mr-1" /> 管理者
          </Badge>
        );
      case "manager":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <UserCog className="h-3 w-3 mr-1" /> マネージャー
          </Badge>
        );
      case "user":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <User className="h-3 w-3 mr-1" /> 一般ユーザー
          </Badge>
        );
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // 権限変更処理
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
    setRolePresetChanged(true);
  };

  // ロールプリセット適用
  const applyRolePreset = (role: string) => {
    const defaultPermissions: string[] = [];

    permissionGroups.forEach((group) => {
      group.permissions.forEach((permission) => {
        if (permission.default.includes(role)) {
          defaultPermissions.push(permission.id);
        }
      });
    });

    setSelectedPermissions(defaultPermissions);
    setRolePresetChanged(false);
  };

  // 権限保存
  const savePermissions = () => {
    // 実際にはAPI呼び出しに置き換え
    if (user) {
      setUser({
        ...user,
        permissions: selectedPermissions,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // 全権限選択
  const selectAllPermissions = () => {
    const allPermissions: string[] = [];
    permissionGroups.forEach((group) => {
      group.permissions.forEach((permission) => {
        allPermissions.push(permission.id);
      });
    });
    setSelectedPermissions(allPermissions);
    setRolePresetChanged(true);
  };

  // 全権限解除
  const clearAllPermissions = () => {
    setSelectedPermissions([]);
    setRolePresetChanged(true);
  };

  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <div className="p-6 space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 -ml-3"
                onClick={() => router.push("/users/list")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold flex items-center">
                <Shield className="mr-2 h-7 w-7 text-blue-600" />
                権限設定
              </h1>
            </div>
            <p className="text-gray-500 mt-1">
              ユーザーのシステムアクセス権限を管理します
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
              onClick={savePermissions}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>

        {/* 状態メッセージ */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="font-medium">エラー</div>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="font-medium text-green-800">保存完了</div>
            <AlertDescription className="text-green-700">
              権限設定が正常に保存されました。
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">データを読み込み中...</span>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ユーザー情報カード */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  ユーザー情報
                </CardTitle>
                <CardDescription>権限を設定するユーザー情報</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium text-lg">{user.name}</div>
                  <div className="text-gray-500 text-sm">@{user.username}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">メール</div>
                  <div className="font-medium">{user.email}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">部署 / 役職</div>
                  <div className="font-medium">
                    {user.department} / {user.position}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">現在のロール</div>
                  <div className="mt-1">{renderRoleBadge(user.role)}</div>
                </div>

                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">
                    ロールプリセット
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={
                        user.role === "admin" && !rolePresetChanged
                          ? "default"
                          : "outline"
                      }
                      className={
                        user.role === "admin" && !rolePresetChanged
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                      onClick={() => applyRolePreset("admin")}
                    >
                      <Key className="h-3 w-3 mr-1" />
                      管理者
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        user.role === "manager" && !rolePresetChanged
                          ? "default"
                          : "outline"
                      }
                      className={
                        user.role === "manager" && !rolePresetChanged
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }
                      onClick={() => applyRolePreset("manager")}
                    >
                      <UserCog className="h-3 w-3 mr-1" />
                      マネージャー
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        user.role === "user" && !rolePresetChanged
                          ? "default"
                          : "outline"
                      }
                      className={
                        user.role === "user" && !rolePresetChanged
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                      onClick={() => applyRolePreset("user")}
                    >
                      <User className="h-3 w-3 mr-1" />
                      一般
                    </Button>
                  </div>
                </div>

                <Alert className="bg-gray-50 border-gray-200 mt-2">
                  <Info className="h-4 w-4 text-gray-600" />
                  <AlertDescription className="text-gray-700 text-sm">
                    権限変更後は必ず「保存」ボタンをクリックしてください。
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-200 px-6 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllPermissions}
                >
                  <X className="h-4 w-4 mr-2" />
                  全解除
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllPermissions}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  全選択
                </Button>
              </CardFooter>
            </Card>

            {/* 権限設定カード */}
            <Card className="border border-gray-200 shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  アクセス権限設定
                </CardTitle>
                <CardDescription>
                  ユーザーに付与する権限を選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full px-6 pt-2">
                    <TabsTrigger
                      value="user_permissions"
                      className="flex items-center gap-2"
                    >
                      <ClipboardList className="h-4 w-4" />
                      機能別権限
                    </TabsTrigger>
                    <TabsTrigger
                      value="role_info"
                      className="flex items-center gap-2"
                    >
                      <Info className="h-4 w-4" />
                      ロール情報
                    </TabsTrigger>
                  </TabsList>

                  {/* 機能別権限タブ */}
                  <TabsContent value="user_permissions" className="p-0">
                    <div className="px-6 pb-6 space-y-4">
                      {permissionGroups.map((group) => (
                        <div key={group.id} className="mt-4">
                          <div className="flex items-center mb-2">
                            <group.icon className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-medium">
                              {group.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {group.description}
                          </p>

                          <div className="space-y-2">
                            {group.permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedPermissions.includes(
                                    permission.id
                                  )}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission.id,
                                      checked as boolean
                                    )
                                  }
                                  className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.name}
                                  </label>
                                  <p className="text-sm text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* ロール情報タブ */}
                  <TabsContent value="role_info" className="p-0">
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        <Alert className="bg-gray-50 border-gray-200 mt-4">
                          <Info className="h-4 w-4 text-gray-600" />
                          <AlertDescription className="text-gray-700">
                            各ロールのデフォルト権限情報です。個別に調整可能です。
                          </AlertDescription>
                        </Alert>

                        {/* ロール別権限情報テーブル */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30%]">
                                機能分類
                              </TableHead>
                              <TableHead className="w-[25%]">
                                権限タイプ
                              </TableHead>
                              <TableHead className="w-[15%]">管理者</TableHead>
                              <TableHead className="w-[15%]">
                                マネージャー
                              </TableHead>
                              <TableHead className="w-[15%]">
                                一般ユーザー
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {permissionGroups.map((group) => (
                              <TableRow key={group.id}>
                                <TableCell className="font-medium">
                                  {group.name}
                                </TableCell>
                                <TableCell className="font-medium">
                                  デフォルト
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-red-600 hover:bg-red-700">
                                    <Key className="h-3 w-3 mr-1" /> 全権限
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-600 hover:bg-blue-700">
                                    <UserCog className="h-3 w-3 mr-1" />{" "}
                                    一部権限
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    <User className="h-3 w-3 mr-1" /> 一部権限
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">ユーザー情報を読み込み中...</p>
          </div>
        )}
      </div>
    </Suspense>
  );
}
