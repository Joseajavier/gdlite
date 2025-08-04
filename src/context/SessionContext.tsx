import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionContextType {
  token: string | null;
  user: any;
  setSession: (token: string, user: any) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const setSession = (newToken: string, newUser: any) => {
    console.log('[SessionContext][TRACE] setSession: token=', newToken, 'user=', newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ token, user, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
