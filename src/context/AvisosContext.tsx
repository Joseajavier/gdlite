import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AvisosContextType {
  avisos: any[];
  setAvisos: (data: any[]) => void;
}

const AvisosContext = createContext<AvisosContextType | undefined>(undefined);

export const AvisosProvider = ({ children }: { children: ReactNode }) => {
  const [avisos, setAvisos] = useState<any[]>([]);
  return (
    <AvisosContext.Provider value={{ avisos, setAvisos }}>
      {children}
    </AvisosContext.Provider>
  );
};

export const useAvisos = () => {
  const context = useContext(AvisosContext);
  if (!context) throw new Error('useAvisos must be used within an AvisosProvider');
  return context;
};
