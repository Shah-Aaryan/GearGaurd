import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Chatbot } from "@/components/shared/Chatbot";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Settings2,
  Users,
  BarChart3,
  Factory,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
  { icon: Wrench, label: "Maintenance", path: "/app/maintenance" },
  { icon: Calendar, label: "Calendar", path: "/app/calendar" },
  { icon: Settings2, label: "Equipment", path: "/app/equipment" },
  { icon: Users, label: "Teams", path: "/app/teams" },
  { icon: Factory, label: "Work Centers", path: "/app/work-centers" },
  { icon: BarChart3, label: "Reporting", path: "/app/reporting" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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
        
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300",
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-0"
          )}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="container py-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <Chatbot />
    </div>
  );
}
