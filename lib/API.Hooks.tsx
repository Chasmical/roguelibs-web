"use client";
import { SessionContextProvider as SupabaseProvider } from "@supabase/auth-helpers-react";
import { createContext, useContext, useMemo, useState } from "react";
import { RogueLibsApi } from "./API";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ApiContext = createContext<RogueLibsApi | null>(null);

export interface ApiProviderProps {}
export function ApiProvider({ children }: React.PropsWithChildren<ApiProviderProps>) {
  const [supabaseClient] = useState(() => createClientComponentClient({ isSingleton: false }));
  const api = useMemo(() => new RogueLibsApi(supabaseClient), [supabaseClient]);

  return (
    <SupabaseProvider supabaseClient={supabaseClient}>
      <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
    </SupabaseProvider>
  );
}

export function useApi() {
  return useContext(ApiContext)!;
}
