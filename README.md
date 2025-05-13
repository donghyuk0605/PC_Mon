# PC_Mon

**PC_Mon** は **PC Monitor** を語源にした造語です。  
「ピーシーモン」という可愛い(?) 響きを採用しました。

社内 PC やサーバー資産を **ブラウザひとつで可視化・管理** する  
**フロントエンド専用ダッシュボード** です。

> ☑️ 資産（PC/サーバー）管理  ☑️ ソフト & ライセンス  ☑️ パッチ配信スケジュール  
> **バックエンド／エージェントは別途構築** してください。  
> 本リポジトリは Next.js + Tailwind CSS + Firebase SDK のみを含みます。

---

## 🛠️ 技術スタック

| レイヤー       | 技術                                      |
| -------------- | ----------------------------------------- |
| フレームワーク | **Next.js 15** (App Router)               |
| 言語           | **TypeScript 5**, React 18                |
| UI / スタイル  | Tailwind CSS 3, lucide-react              |
| データベース   | Firebase **Firestore**, Firebase Auth     |
| 開発ツール     | ESLint / Prettier / Husky (任意)          |
| CI / CD        | GitHub Actions → Vercel・Firebase Hosting |

---

## ⚙️ システム要件

| 項目              | 最低バージョン                        | 備考               |
| ----------------- | ------------------------------------- | ------------------ |
| Node.js           | **20.x** 以上                         | LTS 推奨           |
| npm / pnpm / yarn | **npm 10.x** 以上                     | 他マネージャでも可 |
| OS                | Windows / macOS / Linux               | WSL 2 可           |
| ブラウザ          | 最新 Chrome / Edge / Firefox / Safari | ES2020 対応        |

> **Firebase** を利用する場合、Blaze プラン以上を推奨します。  
> (無料 Spark プランは同時接続数・クオータに制限があります)

---

## ✨ 主な機能

| 画面                 | 概要                                                    |
| -------------------- | ------------------------------------------------------- |
| **PC 資産**          | PC リスト／オンライン状態／カテゴリ別フィルタ／CSV 出力 |
| **ソフトウェア**     | ライセンス数・期限切れ警告・タグ検索                    |
| **パッチ管理**       | パッチ登録／配布スケジュール／重要度／CVE 連携          |
| **リアルタイム更新** | Firestore `onSnapshot()` による即時反映 (任意)          |

---

## 🏁 クイックスタート

```bash
# 依存関係インストール
npm install

# 開発サーバー (http://localhost:3000)
npm run dev

# 本番ビルド
npm run build
npm start
```
