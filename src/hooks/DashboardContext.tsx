import React, { createContext, ReactNode, useContext, useState } from "react";

// 1. Define types
type Slot = {
  id: string;
  time: string;
  isBooked: boolean;
};

type DashboardContextType = {
  slotStatus: string;
  setSlotStatus: (status: string) => void;
  slots: Slot[];
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
};

// 2. Create context with default values
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// 3. Create provider
type DashboardProviderProps = {
  children: ReactNode;
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [slotStatus, setSlotStatus] = useState<string>("available");
  const [slots, setSlots] = useState<Slot[]>([]);

  return (
    <DashboardContext.Provider
      value={{ slotStatus, setSlotStatus, slots, setSlots }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// 4. Custom hook to use the context
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
