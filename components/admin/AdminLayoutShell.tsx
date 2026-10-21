"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutShellProps {
  children: React.ReactNode;
  callerRole: string;
  callerName: string;
}

export default function AdminLayoutShell({
  children,
  callerRole,
  callerName,
}: AdminLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        callerRole={callerRole}
        callerName={callerName}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
