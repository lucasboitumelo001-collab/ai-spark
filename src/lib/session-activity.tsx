import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Activity = {
  id: string;
  tool: "Email" | "Research" | "Chatbot";
  label: string;
  at: Date;
};

type Ctx = {
  activities: Activity[];
  logActivity: (tool: Activity["tool"], label: string) => void;
};

const SessionActivityContext = createContext<Ctx | null>(null);

export function SessionActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const logActivity = useCallback((tool: Activity["tool"], label: string) => {
    setActivities((prev) =>
      [{ id: crypto.randomUUID(), tool, label, at: new Date() }, ...prev].slice(0, 12),
    );
  }, []);

  const value = useMemo(() => ({ activities, logActivity }), [activities, logActivity]);

  return (
    <SessionActivityContext.Provider value={value}>{children}</SessionActivityContext.Provider>
  );
}

export function useSessionActivity() {
  const ctx = useContext(SessionActivityContext);
  if (!ctx) throw new Error("useSessionActivity must be used inside SessionActivityProvider");
  return ctx;
}
