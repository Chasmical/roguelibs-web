import { createServiceApi } from "@lib/API";
import { RedirectType, redirect } from "next/navigation";

export default async function RandomWikiPage() {
  const serviceApi = createServiceApi("SERVICE_ROLE_API", { revalidate: 0 });

  const slug = await serviceApi.rpc("get_random_wiki_page_slug", {});

  return redirect(`/${slug}`, RedirectType.push);
}
