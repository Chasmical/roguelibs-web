import App from "@components/HouseOfCards/App";
import { DbCard } from "@lib/Database";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";

export default async function HouseOfCardsWrapper() {
  const supabase = createServerComponentSupabaseClient({ headers, cookies });

  const res = await supabase.from("hoc_cards").select().returns<DbCard[]>();
  const initialDeck = res.data!.sort((a, b) => a.id - b.id);

  return <App initialDeck={initialDeck} />;
}
