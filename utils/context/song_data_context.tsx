"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {HiddenDataType}  from "@/types";

interface HiddenDataContextType {
  hiddenData: HiddenDataType | null;
  setHiddenData: React.Dispatch<React.SetStateAction<HiddenDataType | null>>;
}

const HiddenDataContext = createContext<HiddenDataContextType | undefined>(undefined);

interface HiddenDataProviderProps {
  children: ReactNode;
}

export const HiddenDataProvider = ({ children }: HiddenDataProviderProps) => {
  const [hiddenData, setHiddenData] = useState<HiddenDataType | null>(null);

  return (
    <HiddenDataContext.Provider value={{ hiddenData, setHiddenData }}>
      {children}
    </HiddenDataContext.Provider>
  );
};

export const useHiddenData = (): HiddenDataContextType => {
  const context = useContext(HiddenDataContext);
  if (!context) {
    throw new Error("useHiddenData must be used within a HiddenDataProvider");
  }
  return context;
};
