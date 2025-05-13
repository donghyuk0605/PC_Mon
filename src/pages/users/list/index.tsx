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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Check,
  Copy,
  FileText,
  Filter,
  Key,
  Lock,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Save,
  Search,
  Shield,
  Trash,
  Unlock,
  User,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

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

// ユーザー一覧ページ
export default function UserListPage() {
  // 状態管理
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [, setSelectedUserId] = useState<number | null>(null);
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

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 実際にはAPI呼び出しに置き換え
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: 1,
              name: "김관리자",
              username: "admin",
              email: "admin@pcmon.com",
              department: "IT부서",
              position: "관리자",
              role: "admin",
              status: "active",
              lastLogin: "2024-05-10 09:15:22",
              dateCreated: "2023-01-01",
              permissions: [
                "user_management",
                "system_settings",
                "hardware_management",
                "software_management",
                "security_management",
              ],
            },
            {
              id: 2,
              name: "박영희",
              username: "yhpark",
              email: "yhpark@pcmon.com",
              department: "인사팀",
              position: "팀장",
              role: "manager",
              status: "active",
              lastLogin: "2024-05-09 16:30:45",
              dateCreated: "2023-02-15",
              permissions: ["user_view", "hardware_view", "software_view"],
            },
            {
              id: 3,
              name: "이철수",
              username: "cslee",
              email: "cslee@pcmon.com",
              department: "개발팀",
              position: "시니어 개발자",
              role: "user",
              status: "active",
              lastLogin: "2024-05-10 11:22:33",
              dateCreated: "2023-03-20",
              permissions: ["hardware_view", "software_view"],
            },
            {
              id: 4,
              name: "정민지",
              username: "mjjung",
              email: "mjjung@pcmon.com",
              department: "디자인팀",
              position: "디자이너",
              role: "user",
              status: "inactive",
              dateCreated: "2023-05-10",
              permissions: ["hardware_view", "software_view"],
            },
            {
              id: 5,
              name: "최준호",
              username: "jhchoi",
              email: "jhchoi@pcmon.com",
              department: "마케팅팀",
              position: "마케팅 담당자",
              role: "user",
              status: "active",
              lastLogin: "2024-05-08 14:07:11",
              dateCreated: "2023-06-01",
              permissions: ["hardware_view", "software_view"],
            },
            {
              id: 6,
              name: "한지연",
              username: "jyhan",
              email: "jyhan@pcmon.com",
              department: "영업팀",
              position: "영업 담당자",
              role: "user",
              status: "active",
              lastLogin: "2024-05-09 10:45:30",
              dateCreated: "2023-07-15",
              permissions: ["hardware_view", "software_view"],
            },
            {
              id: 7,
              name: "임승우",
              username: "swlim",
              email: "swlim@pcmon.com",
              department: "IT부서",
              position: "시스템 엔지니어",
              role: "manager",
              status: "active",
              lastLogin: "2024-05-10 08:30:15",
              dateCreated: "2023-04-05",
              permissions: [
                "hardware_management",
                "software_management",
                "security_management",
              ],
            },
            {
              id: 8,
              name: "송현아",
              username: "hasong",
              email: "hasong@pcmon.com",
              department: "재무팀",
              position: "재무 담당자",
              role: "user",
              status: "locked",
              lastLogin: "2024-04-25 09:20:45",
              dateCreated: "2023-08-10",
              permissions: ["hardware_view", "software_view"],
            },
          ];

          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("データ読み込み中のエラー:", err);
        setError("ユーザー情報の取得に失敗しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // フィルタ済みユーザー一覧
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

  // 部署一覧（重複除去）
  const departments = Array.from(new Set(users.map((user) => user.department)));

  // ユーザー追加処理
  const handleAddUser = () => {
    // 実装ではAPI呼び出しに置き換え
    const newId = Math.max(...users.map((user) => user.id), 0) + 1;
    const user: User = {
      id: newId,
      name: newUser.name || "",
      username: newUser.username || "",
      email: newUser.email || "",
      department: newUser.department || "",
      position: newUser.position || "",
      role: newUser.role || "user",
      status: newUser.status || "active",
      dateCreated: new Date().toISOString().split("T")[0],
      permissions: ["hardware_view", "software_view"],
    };

    setUsers([...users, user]);
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
  };

  // パスワードリセット処理
  const handleResetPassword = () => {
    // 実装ではAPI呼び出しに置き換え

    setShowResetPasswordDialog(false);
    setSelectedUserId(null);
    setSelectedUserName("");
    setNewPassword("");
    setShowNewPassword(false);
  };

  // ステータス変更（有効/無効）
  const handleStatusChange = (id: number, newStatus: string) => {
    // 実装ではAPI呼び出しに置き換え
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  // ユーザー削除処理
  const handleDeleteUser = (id: number) => {
    if (window.confirm("本当にこのユーザーを削除しますか？")) {
      // 実装ではAPI呼び出しに置き換え
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // ランダムパスワード生成
  const generateRandomPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setNewPassword(password);
  };

  // クリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("クリップボードにコピーされました。");
  };

  // 権限バッジレンダリング
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

  // ステータスバッジレンダリング
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <Check className="h-3 w-3 mr-1" /> アクティブ
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-600 hover:bg-gray-700">
            <X className="h-3 w-3 mr-1" /> 非アクティブ
          </Badge>
        );
      case "locked":
        return (
          <Badge className="bg-orange-600 hover:bg-orange-700">
            <Lock className="h-3 w-3 mr-1" /> ロック
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-2 h-7 w-7 text-blue-600" />
            ユーザー一覧
          </h1>
          <p className="text-gray-500 mt-1">
            システムのすべてのユーザーを管理します
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
            <UserPlus className="h-4 w-4 mr-2" />
            ユーザー追加
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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              総ユーザー数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}名</div>
            <div className="text-xs text-gray-500 mt-1">登録ユーザー</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              アクティブユーザー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === "active").length}名
            </div>
            <div className="text-xs text-gray-500 mt-1">ログイン可能</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              管理者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "admin").length}名
            </div>
            <div className="text-xs text-gray-500 mt-1">管理者権限</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              ロックされたアカウント
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === "locked").length}名
            </div>
            <div className="text-xs text-gray-500 mt-1">ログインロック</div>
          </CardContent>
        </Card>
      </div>

      {/* ユーザー一覧テーブル */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>システムユーザー</CardTitle>
              <CardDescription>
                システムに登録されたすべてのユーザーを管理します
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
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-[130px]">
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
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="権限フィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべての権限</SelectItem>
                    <SelectItem value="admin">管理者</SelectItem>
                    <SelectItem value="manager">マネージャー</SelectItem>
                    <SelectItem value="user">一般ユーザー</SelectItem>
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
                        <h4 className="font-medium mb-2">ステータスフィルタ</h4>
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="ステータスフィルタ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              すべてのステータス
                            </SelectItem>
                            <SelectItem value="active">アクティブ</SelectItem>
                            <SelectItem value="inactive">
                              非アクティブ
                            </SelectItem>
                            <SelectItem value="locked">ロック</SelectItem>
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
              <span className="ml-2 text-gray-500">データを読み込み中...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
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
                    <TableHead className="w-[15%]">名前/ユーザー名</TableHead>
                    <TableHead className="w-[15%]">メール</TableHead>
                    <TableHead className="w-[15%]">部署/役職</TableHead>
                    <TableHead className="w-[10%]">権限</TableHead>
                    <TableHead className="w-[10%]">ステータス</TableHead>
                    <TableHead className="w-[15%]">最終ログイン</TableHead>
                    <TableHead className="w-[10%]">作成日</TableHead>
                    <TableHead className="w-[5%] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">
                        {user.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          @{user.username}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{user.department}</div>
                        <div className="text-xs text-gray-500">
                          {user.position}
                        </div>
                      </TableCell>
                      <TableCell>{renderRoleBadge(user.role)}</TableCell>
                      <TableCell>{renderStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <div>
                            <div>{user.lastLogin.split(" ")[0]}</div>
                            <div className="text-xs text-gray-500">
                              {user.lastLogin.split(" ")[1]}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            ログイン履歴なし
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{user.dateCreated}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>ユーザー管理</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setSelectedUserName(user.name);
                                setShowResetPasswordDialog(true);
                                generateRandomPassword();
                              }}
                            >
                              <Key className="h-4 w-4 mr-2" />
                              パスワードリセット
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user.id, "inactive")
                                }
                              >
                                <X className="h-4 w-4 mr-2" />
                                無効化
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user.id, "active")
                                }
                              >
                                <Check className="h-4 w-4 mr-2" />
                                有効化
                              </DropdownMenuItem>
                            )}
                            {user.status === "locked" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user.id, "active")
                                }
                              >
                                <Unlock className="h-4 w-4 mr-2" />
                                アカウントロック解除
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/users/permissions?userId=${user.id}`)
                              }
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              権限管理
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
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
        <CardFooter className="bg-gray-50 border-t border-gray-200 justify-between py-3">
          <div className="text-sm text-gray-500">
            合計 {filteredUsers.length}名 (全 {users.length}名)
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    ユーザーレポート
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ユーザー状況レポート生成</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {/* 新規ユーザー追加ダイアログ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-blue-600" />
              新しいユーザーを追加
            </DialogTitle>
            <DialogDescription>
              新しいユーザー情報を入力してください。パスワードは自動生成され、メールで送信されます。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">部署</label>
                <Input
                  placeholder="部署名"
                  value={newUser.department || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, department: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">役職</label>
                <Input
                  placeholder="役職"
                  value={newUser.position || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, position: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">権限</label>
                <Select
                  value={newUser.role || "user"}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="権限選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理者</SelectItem>
                    <SelectItem value="manager">マネージャー</SelectItem>
                    <SelectItem value="user">一般ユーザー</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ステータス</label>
                <Select
                  value={newUser.status || "active"}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ステータス選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="inactive">非アクティブ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              キャンセル
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddUser}
            >
              <Save className="h-4 w-4 mr-2" />
              ユーザー追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* パスワードリセットダイアログ */}
      <Dialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5 text-blue-600" />
              パスワードリセット
            </DialogTitle>
            <DialogDescription>
              &apos;{selectedUserName}&apos; のパスワードをリセットします。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">新しいパスワード</label>
              <div className="flex">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="ml-2"
                >
                  {showNewPassword ? "非表示" : "表示"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={generateRandomPassword}
                  className="ml-2"
                >
                  生成
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => copyToClipboard(newPassword)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                パスワードは8文字以上で、文字、数字、特殊文字を含む必要があります。
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendEmail"
                className="rounded"
                defaultChecked
              />
              <label htmlFor="sendEmail" className="text-sm">
                ユーザーに新しいパスワードをメールで送信
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
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleResetPassword}
            >
              <Key className="h-4 w-4 mr-2" />
              パスワード変更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* アクティビティログおよびその他の高度な機能は UserListPageExtended コンポーネントで実装します */}
    </div>
  );
}
