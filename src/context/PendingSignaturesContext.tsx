import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PendingSignaturesContextType {
  pendingSignatures: any[] | null;
  setPendingSignatures: (data: any[] | null) => void;
}

const PendingSignaturesContext = createContext<PendingSignaturesContextType | undefined>(undefined);

export const PendingSignaturesProvider = ({ children }: { children: ReactNode }) => {
  const [pendingSignatures, setPendingSignatures] = useState<any[] | null>(null);
  return (
    <PendingSignaturesContext.Provider value={{ pendingSignatures, setPendingSignatures }}>
      {children}
    </PendingSignaturesContext.Provider>
  );
};

export const usePendingSignatures = () => {
  const context = useContext(PendingSignaturesContext);
  if (!context) throw new Error('usePendingSignatures must be used within a PendingSignaturesProvider');
  return context;
};
