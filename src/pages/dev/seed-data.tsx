// src/app/dev/seed-data.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "lib/firebase";
import { useState } from "react";

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ───────────── ① USERS ───────────── */
  const users = [
    {
      name: "山田 太郎",
      username: "taro.yamada",
      email: "taro@pcmon.local",
      department: "開発部",
      position: "リードエンジニア",
      role: "admin",
      status: "active",
    },
    {
      name: "佐藤 花子",
      username: "hanako.sato",
      email: "hanako@pcmon.local",
      department: "開発部",
      position: "フロントエンド",
      role: "manager",
      status: "active",
    },
    {
      name: "鈴木 一郎",
      username: "ichiro.suzuki",
      email: "ichiro@pcmon.local",
      department: "営業部",
      position: "セールスMgr",
      role: "manager",
      status: "active",
    },
    {
      name: "高橋 京子",
      username: "kyoko.t",
      email: "kyoko@pcmon.local",
      department: "総務部",
      position: "HR",
      role: "user",
      status: "active",
    },
    {
      name: "井上 翔",
      username: "sho.inoue",
      email: "sho@pcmon.local",
      department: "IT運用",
      position: "SysAdmin",
      role: "admin",
      status: "active",
    },
    {
      name: "小林 涼",
      username: "ryo.kobayashi",
      email: "ryo@pcmon.local",
      department: "IT運用",
      position: "サポート",
      role: "user",
      status: "inactive",
    },
    {
      name: "渡辺 美咲",
      username: "misaki.w",
      email: "misaki@pcmon.local",
      department: "マーケ",
      position: "アナリスト",
      role: "user",
      status: "active",
    },
    {
      name: "田中 誠",
      username: "makoto.tanaka",
      email: "makoto@pcmon.local",
      department: "財務部",
      position: "会計士",
      role: "user",
      status: "locked",
    },
    {
      name: "伊藤 美由紀",
      username: "miyuki.ito",
      email: "miyuki@pcmon.local",
      department: "人事部",
      position: "人事Mgr",
      role: "admin",
      status: "active",
    },
    {
      name: "中村 由美",
      username: "yumiko.nakamura",
      email: "yumiko@pcmon.local",
      department: "マーケ",
      position: "マーケティングMgr",
      role: "manager",
      status: "active",
    },
    {
      name: "加藤 信也",
      username: "nobuo.kato",
      email: "nobuo@pcmon.local",
      department: "開発部",
      position: "エンジニア",
      role: "user",
      status: "active",
    },
    {
      name: "山本 美代子",
      username: "miedo.yamamoto",
      email: "miedo@pcmon.local",
      department: "マーケ",
      position: "デザイナー",
      role: "user",
      status: "active",
    },
    {
      name: "佐々木 真",
      username: "maki.sasaki",
      email: "maki@pcmon.local",
      department: "開発部",
      position: "エンジニア",
      role: "user",
      status: "active",
    },
    {
      name: "伊藤 真",
      username: "maki.ito",
      email: "maki@pcmon.local",
      department: "開発部",
      position: "エンジニア",
      role: "user",
      status: "active",
    },
    {
      name: "加藤 真",
      username: "maki.kato",
      email: "maki@pcmon.local",
      department: "開発部",
      position: "エンジニア",
      role: "user",
      status: "active",
    },
  ];

  /* ───────────── ② PCS (20대) ───────────── */
  const pcs = Array.from({ length: 20 }).map((_, i) => ({
    name: `PC-${(i + 1).toString().padStart(2, "0")}`,
    status: i % 4 === 0 ? "maintenance" : i % 3 === 0 ? "offline" : "online",
    assignedUser: "", // 나중에 userId 연결
    ipAddress: `10.0.1.${i + 20}`,
    osType: i % 2 === 0 ? "Windows 11 Pro" : "macOS Sonoma",
    department: i % 5 === 0 ? "IT運用" : i % 4 === 0 ? "開発部" : "営業部",
    notes: i % 3 === 0 ? "貸出テスト機" : "",
    type: i % 4 === 0 ? "server" : i % 3 === 0 ? "laptop" : "desktop",
    lastActive: new Date(Date.now() - i * 86_400_000).toISOString(), // i일 전
  }));

  /* ───────────── ③ HARDWARE (12개 샘플) ───────────── */
  const hardware = [
    {
      name: "Intel Core i9-13900K",
      type: "processor",
      manufacturer: "Intel",
      model: "i9-13900K",
      serialNumber: "CPU-A001",
      purchaseDate: "2023-02-10",
      warranty: "36ヶ月",
      status: "active",
      specs: { cores: "24", threads: "32", base: "3.0 GHz" },
      location: "本社1F",
      assignedTo: "PC-01",
    },
    {
      name: "AMD Ryzen 9 7950X",
      type: "processor",
      manufacturer: "AMD",
      model: "7950X",
      serialNumber: "CPU-A002",
      purchaseDate: "2023-05-18",
      warranty: "36ヶ月",
      status: "active",
      specs: { cores: "16", threads: "32", base: "4.5 GHz" },
      location: "本社1F",
      assignedTo: "PC-02",
    },
    {
      name: "Kingston DDR5 32GB",
      type: "memory",
      manufacturer: "Kingston",
      model: "KF560C40",
      serialNumber: "MEM-B003",
      purchaseDate: "2022-09-01",
      warranty: "60ヶ月",
      status: "active",
      specs: { size: "32 GB", speed: "6000 MHz" },
      location: "本社2F",
      assignedTo: "PC-03",
    },
    {
      name: "Samsung 980 PRO 1TB",
      type: "storage",
      manufacturer: "Samsung",
      model: "980 PRO",
      serialNumber: "SSD-C004",
      purchaseDate: "2022-07-22",
      warranty: "60ヶ月",
      status: "active",
      specs: { capacity: "1 TB", interface: "NVMe" },
      location: "本社2F",
      assignedTo: "PC-04",
    },
    {
      name: "Dell U2723QE Monitor",
      type: "display",
      manufacturer: "Dell",
      model: "U2723QE",
      serialNumber: "DSP-D005",
      purchaseDate: "2021-11-11",
      warranty: "36ヶ月",
      status: "active",
      specs: { size: '27"', resolution: "4K" },
      location: "本社3F",
      assignedTo: "PC-05",
    },
    {
      name: "Logitech MX Master 3S",
      type: "peripheral",
      manufacturer: "Logicool",
      model: "MX 3S",
      serialNumber: "PRP-E006",
      purchaseDate: "2023-06-30",
      warranty: "24ヶ月",
      status: "active",
      specs: { dpi: "8000", wireless: "Yes" },
      location: "本社3F",
      assignedTo: "PC-06",
    },
    {
      name: "Crucial P3 Plus 2TB",
      type: "storage",
      manufacturer: "Crucial",
      model: "P3 Plus",
      serialNumber: "SSD-C007",
      purchaseDate: "2023-03-03",
      warranty: "60ヶ月",
      status: "maintenance",
      specs: { capacity: "2 TB", interface: "NVMe" },
      location: "倉庫",
      assignedTo: "",
    },
    {
      name: "Corsair Vengeance 64GB",
      type: "memory",
      manufacturer: "Corsair",
      model: "CMK64GX5",
      serialNumber: "MEM-B008",
      purchaseDate: "2024-01-17",
      warranty: "60ヶ月",
      status: "active",
      specs: { size: "64 GB", speed: "6400 MHz" },
      location: "本社4F",
      assignedTo: "PC-07",
    },
    {
      name: "HP Z2 Mini G9",
      type: "server",
      manufacturer: "HP",
      model: "G9",
      serialNumber: "SRV-F009",
      purchaseDate: "2024-02-20",
      warranty: "36ヶ月",
      status: "active",
      specs: { cpu: "i7-13700", ram: "64 GB" },
      location: "データ室",
      assignedTo: "PC-08",
    },
    {
      name: "Intel Arc A770 GPU",
      type: "peripheral",
      manufacturer: "Intel",
      model: "A770",
      serialNumber: "GPU-G010",
      purchaseDate: "2023-12-02",
      warranty: "36ヶ月",
      status: "inactive",
      specs: { vram: "16 GB", bus: "PCIe 4.0" },
      location: "倉庫",
      assignedTo: "",
    },
    {
      name: "APC Smart-UPS 1500VA",
      type: "peripheral",
      manufacturer: "APC",
      model: "SMT1500IC",
      serialNumber: "UPS-H011",
      purchaseDate: "2020-08-08",
      warranty: "60ヶ月",
      status: "active",
      specs: { output: "1500 VA", runtime: "7 min" },
      location: "データ室",
      assignedTo: "PC-08",
    },
    {
      name: "ASUS ProArt PA32UC",
      type: "display",
      manufacturer: "ASUS",
      model: "PA32UC",
      serialNumber: "DSP-D012",
      purchaseDate: "2019-09-14",
      warranty: "36ヶ月",
      status: "deprecated",
      specs: { size: '32"', resolution: "4K-HDR" },
      location: "開発部",
      assignedTo: "",
    },
  ];

  /* ───────────── ④ SOFTWARE (12개 샘플) ───────────── */
  const software = [
    {
      name: "Visual Studio Code",
      version: "1.90.0",
      licenseType: "無料",
      category: "development",
      installations: 15,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-05-01",
    },
    {
      name: "Microsoft 365 Apps",
      version: "2404",
      licenseType: "サブスクリプション",
      category: "productivity",
      installations: 30,
      maxInstallations: 50,
      status: "active",
      expiryDate: "2025-04-30",
      lastUpdated: "2024-04-15",
    },
    {
      name: "Adobe Photoshop",
      version: "25.5",
      licenseType: "サブスクリプション",
      category: "creative",
      installations: 8,
      maxInstallations: 10,
      status: "expiring-soon",
      expiryDate: "2024-08-15",
      lastUpdated: "2024-05-13",
    },
    {
      name: "Slack",
      version: "4.38",
      licenseType: "無料",
      category: "communication",
      installations: 20,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-05-05",
    },
    {
      name: "Zoom",
      version: "5.17",
      licenseType: "無料",
      category: "communication",
      installations: 18,
      maxInstallations: 0,
      status: "update-required",
      expiryDate: "",
      lastUpdated: "2023-12-30",
    },
    {
      name: "Figma",
      version: "123",
      licenseType: "ボリュームライセンス",
      category: "creative",
      installations: 12,
      maxInstallations: 20,
      status: "active",
      expiryDate: "2025-02-02",
      lastUpdated: "2024-02-25",
    },
    {
      name: "GitHub Desktop",
      version: "3.4",
      licenseType: "無料",
      category: "development",
      installations: 10,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-04-20",
    },
    {
      name: "Docker Desktop",
      version: "4.30",
      licenseType: "無料",
      category: "development",
      installations: 9,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-05-10",
    },
    {
      name: "Notion",
      version: "2.1.9",
      licenseType: "無料",
      category: "productivity",
      installations: 14,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-03-28",
    },
    {
      name: "Miro",
      version: "0.8",
      licenseType: "サブスクリプション",
      category: "creative",
      installations: 6,
      maxInstallations: 10,
      status: "inactive",
      expiryDate: "2024-12-31",
      lastUpdated: "2024-01-11",
    },
    {
      name: "Jira Software",
      version: "9.13",
      licenseType: "サブスクリプション",
      category: "development",
      installations: 7,
      maxInstallations: 15,
      status: "active",
      expiryDate: "2025-01-20",
      lastUpdated: "2024-04-02",
    },
    {
      name: "FortiClient VPN",
      version: "7.2",
      licenseType: "無料",
      category: "security",
      installations: 25,
      maxInstallations: 0,
      status: "update-required",
      expiryDate: "",
      lastUpdated: "2023-11-27",
    },
    {
      name: "NordVPN",
      version: "8.32",
      licenseType: "無料",
      category: "security",
      installations: 18,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-05-15",
    },
    {
      name: "Malwarebytes Anti-Malware",
      version: "4.12",
      licenseType: "無料",
      category: "security",
      installations: 22,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-04-10",
    },
    {
      name: "Trend Micro Deep Security",
      version: "12.0",
      licenseType: "サブスクリプション",
      category: "security",
      installations: 15,
      maxInstallations: 20,
      status: "active",
      expiryDate: "2025-03-31",
      lastUpdated: "2024-03-15",
    },
    {
      name: "Cisco AnyConnect",
      version: "4.10",
      licenseType: "無料",
      category: "security",
      installations: 10,
      maxInstallations: 0,
      status: "active",
      expiryDate: "",
      lastUpdated: "2024-02-28",
    },
    {
      name: "Kaspersky Endpoint Security",
      version: "12.3",
      licenseType: "サブスクリプション",
      category: "security",
      installations: 12,
      maxInstallations: 15,
      status: "active",
      expiryDate: "2025-02-01",
      lastUpdated: "2024-01-15",
    },
    {
      name: "Bitdefender GravityZone",
      version: "24.0",
      licenseType: "サブスクリプション",
      category: "security",
      installations: 14,
      maxInstallations: 20,
      status: "active",
      expiryDate: "2025-01-31",
      lastUpdated: "2024-02-10",
    },
    {
      name: "Sophos Endpoint Protection",
      version: "11.3",
      licenseType: "サブスクリプション",
      category: "security",
      installations: 11,
      maxInstallations: 15,
      status: "active",
      expiryDate: "2025-01-15",
      lastUpdated: "2024-02-05",
    },
  ];

  /* ───────────── ⑤ INSERT ALL ───────────── */

  const insertAllData = async () => {
    setLoading(true);
    try {
      /* users */
      for (const u of users)
        await addDoc(collection(db, "users"), {
          ...u,
          dateCreated: new Date().toISOString(),
        });

      /* userId 목록 가져와서 PC 할당 */
      const userSnap = await getDocs(collection(db, "users"));
      const userIds = userSnap.docs.map((d) => d.id);
      for (let i = 0; i < pcs.length; i++) {
        pcs[i].assignedUser = userIds[i % userIds.length];
        await addDoc(collection(db, "pcs"), pcs[i]);
      }

      /* hardware & software */
      for (const hw of hardware)
        await addDoc(collection(db, "hardware"), {
          ...hw,
          createdAt: new Date().toISOString(),
        });
      for (const sw of software)
        await addDoc(collection(db, "software"), {
          ...sw,
          createdAt: new Date().toISOString(),
        });

      setMessage("✅ 全てのダミーデータを正常に追加しました！");
    } catch (e) {
      console.error(e);
      setMessage("❌ データ挿入に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  const clearAllData = async () => {
    setLoading(true);
    try {
      // 컬렉션 이름 배열
      const colls = ["users", "pcs", "hardware", "software"];
      for (const c of colls) {
        const snap = await getDocs(collection(db, c));
        // ❗ 실제 서비스라면 ‘seed 전용’ 문서만 지우도록 필터링 로직을 넣어주세요
        const deletes = snap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletes);
      }
      setMessage("🗑  全デモデータを削除しました！");
    } catch (e) {
      console.error(e);
      setMessage("❌  削除に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────── JSX ───────────── */
  return (
    <Card className="p-6 space-y-4">
      {/* …중략… */}
      <div className="flex gap-2">
        <Button onClick={insertAllData} disabled={loading}>
          {loading ? "挿入中…" : "▶ ダミーデータ追加"}
        </Button>
        <Button variant="destructive" onClick={clearAllData} disabled={loading}>
          {loading ? "削除中…" : "🗑 ダミーデータ削除"}
        </Button>
      </div>
      {message && <p className="text-sm text-center mt-3">{message}</p>}
    </Card>
  );
}
