"use client";
import { SessionContextProvider as SupabaseProvider, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { RestUser, RogueLibsApi } from "./API";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseSession } from "@lib/hooks";

interface ApiContext {
  api: RogueLibsApi;
}
const ApiContext = createContext<ApiContext | null>(null);

export interface ApiProviderProps {}
export function ApiProvider({ children }: React.PropsWithChildren<ApiProviderProps>) {
  const [supabaseClient] = useState(() => createClientComponentClient({ isSingleton: false }));

  return (
    <SupabaseProvider supabaseClient={supabaseClient}>
      <SubProvider>{children}</SubProvider>
    </SupabaseProvider>
  );
}
function SubProvider({ children }: React.PropsWithChildren) {
  const supabaseClient = useSupabaseClient();
  const session = useSupabaseSession();
  const [user, setUser] = useState<RestUser | null>(null);

  const value = useMemo(() => {
    return { api: new RogueLibsApi(supabaseClient, user) };
  }, [supabaseClient, user]);

  const user_id = session?.user.id;
  useEffect(() => {
    if (user_id) {
      (async () => {
        const result = await value.api.fetchUserById(user_id);
        setUser(result);
      })();
    }
  }, [user_id]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext)!.api;
}

export function useUser(user_id: string | null | undefined) {
  const [user, setUser] = useState<RestUser | null>(null);
  const api = useApi();
  const session = useSupabaseSession();

  useEffect(() => {
    if (user_id) {
      const current = (session?.user as any)["rlUser"];
      if (current?.id === user_id) {
        setUser(current);
        return;
      }

      (async () => {
        const result = await api.fetchUserById(user_id);
        if (session) Object.assign(session.user, { rlUser: result });
        setUser(result);
      })();
    }
  }, [user_id]);

  return user;
}
