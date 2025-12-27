import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Chatbot } from "@/components/shared/Chatbot";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        showMenuButton
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <motion.main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300",
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-0"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-6">
            <Outlet />
          </div>
        </motion.main>
      </div>

      <Chatbot />
    </div>
  );
}
