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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "lib/firebase"; // Firebase の初期化済みインスタンス
import {
  AlertCircle,
  Check,
  Copy,
  Key,
  Lock,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Save,
  Trash,
  Unlock,
  User,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Firestore 上は自動生成される文字列キーを id にするため string 型に変更
type User = {
  id: string;
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

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ダイアログ制御
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    username: "",
    email: "",
    department: "",
    position: "",
    role: "user",
    status: "active",
  });
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Firestore の users コレクションにリアルタイム接続
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"), orderBy("dateCreated", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }));
        setUsers(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("ユーザー情報の取得に失敗しました。");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // フィルタ処理
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || user.department === departmentFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const departments = Array.from(new Set(users.map((u) => u.department)));

  /** 新規ユーザー追加 */
  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.username ||
      !newUser.email ||
      !newUser.department
    ) {
      setError("必須項目が未入力です。");
      return;
    }
    try {
      await addDoc(collection(db, "users"), {
        ...newUser,
        dateCreated: new Date().toISOString(),
        // 省略可能な lastLogin は追加時は undefined
        lastLogin: "",
        permissions: ["hardware_view", "software_view"],
      });
      setShowAddDialog(false);
      setNewUser({
        name: "",
        username: "",
        email: "",
        department: "",
        position: "",
        role: "user",
        status: "active",
      });
    } catch (err) {
      console.error(err);
      setError("ユーザーの追加に失敗しました。");
    }
  };

  /** ステータス更新 */
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const ref = doc(db, "users", id);
      await updateDoc(ref, { status: newStatus });
    } catch (err) {
      console.error(err);
      setError("ステータス変更に失敗しました。");
    }
  };

  /** パスワードリセット ダミー処理（実際は Cloud Function など） */
  const handleResetPassword = async () => {
    // ここで実際のパスワード更新 API を叩く想定
    setShowResetPasswordDialog(false);
    setSelectedUserId(null);
    setNewPassword("");
    setShowNewPassword(false);
    alert(`${selectedUserName} さんのパスワードをリセットしました（仮）`);
  };

  /** ユーザー削除 */
  const handleDeleteUser = async (id: string) => {
    if (!confirm("本当にこのユーザーを削除しますか？")) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      console.error(err);
      setError("ユーザー削除に失敗しました。");
    }
  };

  /** ランダムパスワード生成 */
  const generateRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pwd);
  };

  /** クリップボードコピー */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("クリップボードにコピーしました。");
  };

  /** 権限バッジ */
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-600">
            <Key className="h-3 w-3 mr-1" /> 管理者
          </Badge>
        );
      case "manager":
        return (
          <Badge className="bg-blue-600">
            <UserCog className="h-3 w-3 mr-1" /> マネージャー
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-600">
            <User className="h-3 w-3 mr-1" /> 一般
          </Badge>
        );
    }
  };

  /** ステータスバッジ */
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600">
            <Check className="h-3 w-3 mr-1" /> アクティブ
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-600">
            <X className="h-3 w-3 mr-1" /> 無効
          </Badge>
        );
      default:
        return (
          <Badge className="bg-orange-600">
            <Lock className="h-3 w-3 mr-1" /> ロック
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-2 h-7 w-7 text-blue-600" />
            ユーザー一覧
          </h1>
          <p className="text-gray-500 mt-1">システムユーザーを管理します。</p>
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
            className="bg-blue-600"
            onClick={() => setShowAddDialog(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            ユーザー追加
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* フィルタ】 */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="部署フィルタ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての部署</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="権限フィルタ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての権限</SelectItem>
            <SelectItem value="admin">管理者</SelectItem>
            <SelectItem value="manager">マネージャー</SelectItem>
            <SelectItem value="user">一般</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="ステータスフィルタ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのステータス</SelectItem>
            <SelectItem value="active">アクティブ</SelectItem>
            <SelectItem value="inactive">無効</SelectItem>
            <SelectItem value="locked">ロック</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* テーブル表示 */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>ユーザー一覧</CardTitle>
          <CardDescription>Firestore と連携した CRUD</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              該当ユーザーが見つかりません。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>名前</TableHead>
                    <TableHead>メール</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>権限</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>最終ログイン</TableHead>
                    <TableHead>作成日</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">
                          @{u.username}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{u.department}</div>
                        <div className="text-xs text-gray-500">
                          {u.position}
                        </div>
                      </TableCell>
                      <TableCell>{renderRoleBadge(u.role)}</TableCell>
                      <TableCell>{renderStatusBadge(u.status)}</TableCell>
                      <TableCell>{u.lastLogin ? u.lastLogin : "―"}</TableCell>
                      <TableCell>{u.dateCreated}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(u.id);
                                setSelectedUserName(u.name);
                                setShowResetPasswordDialog(true);
                                generateRandomPassword();
                              }}
                            >
                              <Key className="mr-2" />
                              パスワードリセット
                            </DropdownMenuItem>
                            {u.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(u.id, "inactive")
                                }
                              >
                                <X className="mr-2" />
                                無効化
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(u.id, "active")
                                }
                              >
                                <Check className="mr-2" />
                                有効化
                              </DropdownMenuItem>
                            )}
                            {u.status === "locked" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(u.id, "active")
                                }
                              >
                                <Unlock className="mr-2" />
                                ロック解除
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              <Trash className="mr-2" />
                              ユーザー削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- ダイアログ: ユーザー追加 --- */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新規ユーザー追加</DialogTitle>
            <DialogDescription>
              必須項目を入力のうえ「ユーザー追加」をクリックしてください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="名前"
              value={newUser.name || ""}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="ユーザー名"
              value={newUser.username || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <Input
              placeholder="メールアドレス"
              value={newUser.email || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Input
              placeholder="部署"
              value={newUser.department || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, department: e.target.value })
              }
            />
            <Input
              placeholder="役職"
              value={newUser.position || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, position: e.target.value })
              }
            />
            <Select
              value={newUser.role || "user"}
              onValueChange={(v) => setNewUser({ ...newUser, role: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="権限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="manager">マネージャー</SelectItem>
                <SelectItem value="user">一般</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newUser.status || "active"}
              onValueChange={(v) => setNewUser({ ...newUser, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">アクティブ</SelectItem>
                <SelectItem value="inactive">無効</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              キャンセル
            </Button>
            <Button className="bg-blue-600" onClick={handleAddUser}>
              <Save className="mr-2" /> ユーザー追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- ダイアログ: パスワードリセット --- */}
      <Dialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>パスワードリセット</DialogTitle>
            <DialogDescription>ユーザー: {selectedUserName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowNewPassword((p) => !p)}
              >
                {showNewPassword ? "非表示" : "表示"}
              </Button>
              <Button variant="outline" onClick={generateRandomPassword}>
                生成
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(newPassword)}
              >
                <Copy />
              </Button>
            </div>
            <div>
              <input
                type="checkbox"
                id="sendEmail"
                defaultChecked
                className="rounded"
              />
              <label htmlFor="sendEmail" className="ml-2 text-sm">
                メールで通知
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetPasswordDialog(false)}
            >
              キャンセル
            </Button>
            <Button className="bg-blue-600" onClick={handleResetPassword}>
              <Key className="mr-2" />
              リセット実行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
