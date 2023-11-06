import { createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import { compileMDX } from "@lib/mdx";
import MdxPreviewIndexClient from "./client";

interface PageProps {
  params: { uid: string };
}

export default async function MdxPreviewIndex({ params }: PageProps) {
  const api = createServerApi({ headers, cookies }, false);

  const preview = await api.fetchMdxPreview(params.uid);
  if (!preview) notFound();

  const { content } = await compileMDX(preview.source, o => (o.mdxOptions.format = "md"));

  return <MdxPreviewIndexClient>{content}</MdxPreviewIndexClient>;
}
