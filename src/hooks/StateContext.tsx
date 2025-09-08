"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AppState {
  selectedFamilyPlan: string | null;
  slotId: string | null;
  slotDate: string | null;
}

interface StateContextType {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

// Create the context
const StateContext = createContext<StateContextType | undefined>(undefined);

// Provider component
interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    selectedFamilyPlan: null,
    slotId: null,
    slotDate: null,
  });

  const value: StateContextType = {
    appState: state,
    setAppState: setState,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};

export default StateContext;
