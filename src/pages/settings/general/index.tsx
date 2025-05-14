// src/app/settings/general/page.tsx
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Bell,
  Check,
  Database,
  Monitor,
  Save,
  Settings,
  Shield,
} from "lucide-react";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 設定の状態管理
  const [settings, setSettings] = useState({
    systemName: "PCMon",
    organizationName: "株式会社サンプル",
    adminEmail: "admin@pcmon.local",
    language: "ja",
    timezone: "Asia/Tokyo",
    theme: "dark",
    autoUpdate: true,
    sendNotifications: true,
    maintenanceMode: false,
    dataRetentionDays: 90,
    sessionTimeout: 30,
    allowPublicAccess: false,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // ここで設定を保存する処理を実装
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 仮の遅延
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("保存エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          システム設定
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          システム全体の基本設定を管理します
        </p>
      </div>

      {saved && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            設定が正常に保存されました
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">基本設定</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="appearance">外観</TabsTrigger>
          <TabsTrigger value="advanced">詳細設定</TabsTrigger>
        </TabsList>

        {/* 基本設定タブ */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                基本設定
              </CardTitle>
              <CardDescription>
                システムの基本的な情報を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">システム名</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) =>
                      updateSetting("systemName", e.target.value)
                    }
                    placeholder="システム名を入力"
                  />
                  <p className="text-sm text-slate-500">
                    管理画面に表示されるシステム名です
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationName">組織名</Label>
                  <Input
                    id="organizationName"
                    value={settings.organizationName}
                    onChange={(e) =>
                      updateSetting("organizationName", e.target.value)
                    }
                    placeholder="組織名を入力"
                  />
                  <p className="text-sm text-slate-500">
                    レポートやメールに使用される組織名です
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">管理者メールアドレス</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) =>
                      updateSetting("adminEmail", e.target.value)
                    }
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">タイムゾーン</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => updateSetting("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="タイムゾーンを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">
                        Asia/Tokyo (JST)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EST)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティタブ */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                セキュリティ設定
              </CardTitle>
              <CardDescription>
                システムのセキュリティに関する設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">メンテナンスモード</Label>
                    <p className="text-sm text-slate-500">
                      有効にすると、管理者以外のアクセスを制限します
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      updateSetting("maintenanceMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publicAccess">パブリックアクセス</Label>
                    <p className="text-sm text-slate-500">
                      ログインなしでの一部情報へのアクセスを許可します
                    </p>
                  </div>
                  <Switch
                    id="publicAccess"
                    checked={settings.allowPublicAccess}
                    onCheckedChange={(checked) =>
                      updateSetting("allowPublicAccess", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    セッションタイムアウト（分）
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        updateSetting(
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32"
                      min="5"
                      max="120"
                    />
                    <span className="text-sm text-slate-500">分</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    非アクティブ状態が続いた場合の自動ログアウト時間
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知タブ */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                通知設定
              </CardTitle>
              <CardDescription>
                システムからの通知に関する設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendNotifications">システム通知</Label>
                    <p className="text-sm text-slate-500">
                      重要なシステムイベントの通知を受け取ります
                    </p>
                  </div>
                  <Switch
                    id="sendNotifications"
                    checked={settings.sendNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("sendNotifications", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>通知チャンネル</Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                        defaultChecked
                      />
                      <span>メール通知</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                        defaultChecked
                      />
                      <span>ブラウザ通知</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                      />
                      <span>Slack通知</span>
                      <Badge variant="secondary" className="ml-2">
                        準備中
                      </Badge>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 外観タブ */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                外観設定
              </CardTitle>
              <CardDescription>
                ユーザーインターフェースの外観をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">テーマ</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="テーマを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">ライト</SelectItem>
                      <SelectItem value="dark">ダーク</SelectItem>
                      <SelectItem value="system">システム設定に従う</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-500">
                    アプリケーションの配色テーマを選択します
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">言語</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="言語を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 詳細設定タブ */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                詳細設定
              </CardTitle>
              <CardDescription>
                システムの詳細な動作設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoUpdate">自動アップデート</Label>
                    <p className="text-sm text-slate-500">
                      システムの自動アップデートを有効にします
                    </p>
                  </div>
                  <Switch
                    id="autoUpdate"
                    checked={settings.autoUpdate}
                    onCheckedChange={(checked) =>
                      updateSetting("autoUpdate", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">データ保持期間（日）</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="dataRetention"
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) =>
                        updateSetting(
                          "dataRetentionDays",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-32"
                      min="30"
                      max="365"
                    />
                    <span className="text-sm text-slate-500">日</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    古いログやデータを自動的に削除するまでの期間
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    詳細設定の変更は、システムの動作に大きく影響する可能性があります。
                    変更前に必ずドキュメントをご確認ください。
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 保存ボタン */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" disabled={loading}>
          キャンセル
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              保存中...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              変更を保存
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
