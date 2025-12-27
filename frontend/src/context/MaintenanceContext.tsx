import { createContext, useContext, useState, ReactNode } from "react";
import { MaintenanceRequest, mockMaintenanceRequests } from "@/data/mockData";

interface MaintenanceContextType {
  requests: MaintenanceRequest[];
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void;
  addRequest: (request: MaintenanceRequest) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);

  const updateRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const addRequest = (request: MaintenanceRequest) => {
    setRequests((prev) => [...prev, request]);
  };

  return (
    <MaintenanceContext.Provider value={{ requests, updateRequest, addRequest }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenanceRequests() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenanceRequests must be used within MaintenanceProvider");
  }
  return context;
}
