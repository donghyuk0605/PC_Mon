# PC_Mon

**PC_Mon** は **PC Monitor**（PC モニター）を略した造語で、  
「ピーシーモン」という親しみやすい響きを意識して名付けました。

本プロジェクトは、社内の PC やサーバー資産を  
**ブラウザだけで可視化・一元管理できる** フロントエンド専用ダッシュボードです。

> ☑️ PC / サーバー資産管理  ☑️ ソフトウェア＆ライセンス管理  ☑️ パッチ配布スケジューリング  
> ⚠️ **バックエンドやエージェントの構築は別途必要です。**  
> このリポジトリには Next.js + Tailwind CSS + Firebase SDK のみが含まれています。

---

## 🛠️ 技術スタック

| レイヤー       | 使用技術                                        |
| -------------- | ----------------------------------------------- |
| フレームワーク | **Next.js 15**（Pages Router）                  |
| 言語           | **TypeScript 5**, React 18                      |
| UI / スタイル  | Tailwind CSS 3, lucide-react                    |
| データベース   | Firebase **Firestore**, Firebase Authentication |
| 開発支援       | ESLint / Prettier / Husky（任意）               |
| CI / CD        | GitHub Actions → Vercel / Firebase Hosting      |

---

## ⚙️ システム要件

| 項目              | 推奨バージョン                            | 備考                         |
| ----------------- | ----------------------------------------- | ---------------------------- |
| Node.js           | **20.x** 以上                             | LTS を推奨                   |
| npm / pnpm / yarn | **npm 10.x** 以上                         | 他のパッケージマネージャも可 |
| OS                | Windows / macOS / Linux                   | WSL2 対応                    |
| ブラウザ          | 最新版の Chrome / Edge / Firefox / Safari | ES2020 以上対応必須          |

> ※ Firebase のご利用は Blaze プラン以上を推奨します。  
> （無料の Spark プランでは同時接続数や帯域に制限があります）

---

## ✨ 主な機能

| ページ               | 説明                                                             |
| -------------------- | ---------------------------------------------------------------- |
| **PC 資産管理**      | 登録済み PC 一覧、オンライン状態、カテゴリフィルタ、CSV 出力対応 |
| **ソフトウェア管理** | ライセンス数、期限警告、タグ検索機能                             |
| **パッチ管理**       | パッチ登録、配布スケジュール設定、重大度ラベル、CVE 連携対応     |
| **リアルタイム更新** | Firestore の `onSnapshot()` による即時同期（任意）               |

---

## 🚀 クイックスタート

```bash
# パッケージインストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev

# 本番ビルド
npm run build
npm start
```
