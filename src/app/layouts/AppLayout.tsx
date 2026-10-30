import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../../shared/components/layout/Header";
import { Sidebar } from "../../shared/components/layout/Sidebar";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <main className="min-h-screen pt-20 md:ml-72">
        <div className="fixed neo-inset rounded-tl-md mx-auto min-h-screen w-full p-4 md:p-8"></div>
        <div className="rounded-tl-lg mx-auto max-w-[1600px] p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
