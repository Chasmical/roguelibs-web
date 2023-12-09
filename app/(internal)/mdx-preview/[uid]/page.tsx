import { createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import MdxPreviewIndexClient from "./client";
import { compileMdx } from "@lib/mdx";
import configurePlugins from "@lib/mdx/plugins";
import configureComponents from "@lib/mdx/components";

interface PageProps {
  params: { uid: string };
}

export default async function MdxPreviewIndex({ params }: PageProps) {
  const api = createServerApi({ headers, cookies }, false);

  const preview = await api.fetchMdxPreview(params.uid);
  if (!preview) notFound();

  const { content } = await compileMdx(preview.source, {
    format: preview.is_verified ? "mdx" : "md",
    ...configurePlugins(),
    components: configureComponents(),
  });

  return <MdxPreviewIndexClient>{content}</MdxPreviewIndexClient>;
}
