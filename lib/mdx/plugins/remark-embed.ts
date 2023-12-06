import type { Paragraph } from "mdast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { format as formatUrl, parse as parseUrl } from "url";

// Code adapted and repurposed from https://github.com/sergioramos/remark-oembed

function processProviders(providers: oEmbedProvider[]) {
  for (const provider of providers) {
    provider.endpoints ??= [];
    for (const endpoint of provider.endpoints) {
      endpoint.schemes ??= [];
      for (let i = 0, length = endpoint.schemes.length; i < length; i++) {
        const scheme = endpoint.schemes[i];
        if (typeof scheme === "string") {
          endpoint.schemes[i] = new RegExp(`^${scheme.replaceAll(".", "\\.").replaceAll("*", ".*")}$`);
        }
      }
    }
  }
  return providers as oEmbedProviderInternal[];
}

export async function fetchOEmbedProviders() {
  const res = await fetch("https://oembed.com/providers.json");
  return (await res.json()) as oEmbedProvider[];
}

export interface RemarkEmbedOptions {
  providers?: oEmbedProvider[] | (() => oEmbedProvider[] | Promise<oEmbedProvider[]>);
  extraProviders?: oEmbedProvider[] | (() => oEmbedProvider[]);
  componentName?: string;
  componentNames?: [provider_name: string, componentName: string][];
  size?: [width: number, height: number];
}

export default function remarkEmbed(options?: RemarkEmbedOptions): Transformer {
  return async tree => {
    options ??= {};
    const getProviders = options.providers ?? fetchOEmbedProviders;
    const providers = processProviders(Array.isArray(getProviders) ? getProviders : await getProviders());

    const extraProviders = options.extraProviders;
    if (extraProviders != null) {
      providers.push(...processProviders(Array.isArray(extraProviders) ? extraProviders : extraProviders()));
    }

    for (const pair of options.componentNames ?? []) {
      const provider = providers.find(p => p.provider_name === pair[0]);
      provider && (provider.componentName = pair[1]);
    }

    const size = options.size ?? [800, 450];

    const tasks: Promise<any>[] = [];

    interface EndpointInfo {
      url: string;
      query: Record<string, unknown> & { url: string };
      componentName: string | undefined;
    }

    function findEndpoint(url: string): EndpointInfo | undefined {
      for (const provider of providers) {
        for (const endpoint of provider.endpoints) {
          for (const scheme of endpoint.schemes) {
            if (scheme.test(url)) {
              return {
                url: endpoint.url,
                query: { url, ...endpoint.params },
                componentName: provider.componentName,
              };
            }
          }
        }
      }
    }
    async function transformEmbed(para: Paragraph, endpoint: EndpointInfo) {
      try {
        const oEmbedUrl = parseUrl(endpoint.url, true);
        Object.assign(oEmbedUrl.query, endpoint.query, {
          format: "json",
          maxwidth: size[0],
          maxheight: size[1],
        });
        const res = await fetch(formatUrl(oEmbedUrl));
        const response = (await res.json()) as oEmbedResponse;

        const node = para as any;
        node.attributes = [
          { type: "mdxJsxAttribute", name: "type", value: response.type },
          { type: "mdxJsxAttribute", name: "url", value: endpoint.query.url },
          { type: "mdxJsxAttribute", name: "data", value: JSON.stringify(response) },
        ];
        node.type = "mdxJsxFlowElement";
        node.name = endpoint.componentName ?? options?.componentName ?? "Embed";
        node.children = [];
      } catch (error) {
        console.error(error);
      }
    }

    visit(tree, "paragraph", (node: Paragraph) => {
      if (node.children.length === 1 && node.children[0].type === "link") {
        const link = node.children[0];
        const endpoint = findEndpoint(link.url);
        if (!endpoint) return;
        tasks.push(transformEmbed(node, endpoint));
      }
    });

    await Promise.all(tasks);
  };
}

interface oEmbedProviderInternal extends oEmbedProvider {
  endpoints: oEmbedEndpointInternal[];
}
interface oEmbedEndpointInternal extends oEmbedEndpoint {
  schemes: RegExp[];
}

export interface oEmbedProvider {
  provider_name: string;
  provider_url: string;
  endpoints?: oEmbedEndpoint[];
  componentName?: string;
}
export interface oEmbedEndpoint {
  schemes?: (RegExp | string)[];
  url: string;
  discovery?: boolean;
  formats?: ("json" | "xml")[];
  params?: Record<string, unknown>;
}

interface oEmbedResponseBase {
  type: "photo" | "video" | "link" | "rich";
  version: "1.0";
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  cache_age?: number;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}
export interface oEmbedPhotoResponse extends oEmbedResponseBase {
  type: "photo";
  url: string;
  width: number;
  height: number;
}
export interface oEmbedVideoResponse extends oEmbedResponseBase {
  type: "video";
  html: string;
  width: number;
  height: number;
}
export interface oEmbedLinkResponse extends oEmbedResponseBase {
  type: "link";
  width?: never;
  height?: never;
}
export interface oEmbedRichResponse extends oEmbedResponseBase {
  type: "rich";
  html: string;
  width: number;
  height: number;
}

export type oEmbedResponse = oEmbedPhotoResponse | oEmbedVideoResponse | oEmbedLinkResponse | oEmbedRichResponse;
export type oEmbedResponseType = oEmbedResponse["type"];
