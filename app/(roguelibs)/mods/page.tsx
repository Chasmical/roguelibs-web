import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import ModListPage from "@components/ModListPage";

export default async function ModsPageIndex() {
  const api = createServerApi({ headers, cookies }, { revalidate: 300 });

  const mods = await api.fetchTopMods(50);

  return (
    <>
      <ModListPage mods={mods} />
      <SetCanonicalUrl url={`/mods`} />
    </>
  );
}
