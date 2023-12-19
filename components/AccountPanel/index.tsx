import styles from "./index.module.scss";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AccountInfo, SignInPanel } from "./client";

export default async function AccountPanel() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });
  const session = (await supabase.auth.getSession()).data.session;

  return <div className={styles.wrapper}>{session ? <AccountInfo /> : <SignInPanel />}</div>;
}
