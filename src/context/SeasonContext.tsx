import { createContext, useContext, useState, type ReactNode } from 'react';
import { defaultSeasonId, type SeasonId } from '../config/seasons';

interface SeasonContextValue {
  season: SeasonId;
  setSeason: (id: SeasonId) => void;
}

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<SeasonId>(defaultSeasonId);
  return <SeasonContext.Provider value={{ season, setSeason }}>{children}</SeasonContext.Provider>;
}

export function useSeason(): SeasonContextValue {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be used within a SeasonProvider');
  return ctx;
}
