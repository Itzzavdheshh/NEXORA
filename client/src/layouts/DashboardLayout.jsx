import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-premium-radial dark:bg-[#050812]">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
