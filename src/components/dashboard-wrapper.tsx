// src/components/dashboard-wrapper.tsx
"use client";

import { DashboardClient } from "./dashboard";

export default function DashboardWrapper() {
  const [settest, test] = useState(1);

  function() {
    settest
  }
  return <DashboardClient />;
}
