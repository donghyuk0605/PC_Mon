"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firebase";
import { AlertCircle, Eye, EyeOff, Lock, Server, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent, test = false) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = test ? "test@test.com" : email;
    const loginPassword = test ? "123456" : password;

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/invalid-email":
          setError("メール形式が正しくありません");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("メールアドレスまたはパスワードが正しくありません");
          break;
        case "auth/too-many-requests":
          setError(
            "ログイン試行回数が多すぎます。しばらくしてから再試行してください"
          );
          break;
        default:
          setError("ログインに失敗しました。もう一度お試しください");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl shadow-lg mb-4">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                PCMon ログイン
              </h1>
              <p className="text-sm text-slate-400">
                システムにアクセスするにはログインしてください
              </p>
            </div>

            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={(e) => handleLogin(e)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="admin@pcmon.local"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-500 bg-slate-700 border-slate-600"
                  />
                  <span className="ml-2 text-sm text-slate-300">
                    ログイン状態を保持
                  </span>
                </label>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  パスワードを忘れた方
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium py-2.5"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ログイン中...
                  </div>
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            {/* テストログイン */}
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={(e) => handleLogin(e, true)}
              >
                テストログイン（test@test.com）
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Beta v0.1.0 | © 2025 PCMon
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            このシステムへの不正アクセスは禁止されています
          </p>
        </div>
      </div>
    </div>
  );
}
