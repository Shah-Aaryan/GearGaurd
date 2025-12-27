import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import Calendar from "./pages/Calendar";
import Equipment from "./pages/Equipment";
import ThreeDEquipments from "./pages/threedEquipments";
import Teams from "./pages/Teams";
import WorkCenters from "./pages/WorkCenters";
import Reporting from "./pages/Reporting";
import { AppLayout } from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import ThreeDEquipments from "./pages/threedEquipments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <MaintenanceProvider>
          <EquipmentProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/app" element={<AppLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="teams" element={<Teams />} />
                  <Route path="work-centers" element={<WorkCenters />} />
                  <Route path="reporting" element={<Reporting />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </EquipmentProvider>
        </MaintenanceProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
