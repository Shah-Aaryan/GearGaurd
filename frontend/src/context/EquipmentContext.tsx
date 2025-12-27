import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Equipment, mockEquipment } from "@/data/mockData";

interface EquipmentContextType {
  equipment: Equipment[];
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  addEquipment: (newEquipment: Equipment) => void;
  getEquipmentByName: (name: string) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);


export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const stored = localStorage.getItem('equipment');
    return stored ? JSON.parse(stored) : mockEquipment;
  });

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }, [equipment]);

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, ...updates } : eq))
    );
  };

  const addEquipment = (newEquipment: Equipment) => {
    setEquipment((prev) => [newEquipment, ...prev]);
  };

  const getEquipmentByName = (name: string) => {
    return equipment.find((eq) => eq.name === name);
  };

  return (
    <EquipmentContext.Provider value={{ equipment, updateEquipment, addEquipment, getEquipmentByName }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipment must be used within EquipmentProvider");
  }
  return context;
}
