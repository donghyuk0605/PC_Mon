// components/skeleton-dashboard.tsx
"use client";

export default function SkeletonDashboardUI() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}
