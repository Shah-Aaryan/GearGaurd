import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
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
  Box,
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
  { icon: Box , label: "3D Equipments", path: "/app/equipment-3d" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <nav className="flex gap-2 ml-8">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </Navbar>
      {/* Search bar below navbar */}
      <div className="w-full flex justify-center bg-background border-b px-4 py-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment, requests, teams..."
            className="pl-10 bg-muted/50"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>
      <motion.main
        className="flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-6">
          <Outlet />
        </div>
      </motion.main>
      <Chatbot />
    </div>
  );
}
