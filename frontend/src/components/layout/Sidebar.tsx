import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Settings2,
  Users,
  BarChart3,
  ChevronLeft,
  Factory,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
  { icon: Wrench, label: "Maintenance", path: "/app/maintenance" },
  { icon: Calendar, label: "Calendar", path: "/app/calendar" },
  { icon: Settings2, label: "Equipment", path: "/app/equipment" },
  { icon: Users, label: "Teams", path: "/app/teams" },
  { icon: Factory, label: "Work Centers", path: "/app/work-centers" },
  { icon: BarChart3, label: "Reporting", path: "/app/reporting" },
];

export function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 },
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] border-r bg-sidebar lg:static lg:z-0 lg:translate-x-0 lg:opacity-100",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      // Only close sidebar on mobile
                      if (window.innerWidth < 1024) {
                        onClose?.();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                    </motion.div>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground"
                      />
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>

          {/* Collapse Toggle (Desktop only) */}
          <div className="hidden border-t p-3 lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="w-full justify-start"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
