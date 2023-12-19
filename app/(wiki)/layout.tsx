import { ScrollControllerProvider } from "@lib/hooks/useScrollPositionBlocker";
import { CustomSearchParamsProvider } from "@lib/hooks/useSearchParams";
import WikiLayout from "@components/WikiLayout";
import type { Metadata, Viewport } from "next";
import { ApiProvider } from "@lib/API.Hooks";
import localFont from "next/font/local";
import "../global.scss";
import "normalize.css";

const munroFont = localFont({
  src: "../Munro.woff2",
  display: "swap",
  fallback: ["Munro"],
  declarations: [
    { prop: "font-smooth", value: "never" },
    { prop: "-webkit-font-smoothing", value: "none" },
    { prop: "-moz-osx-font-smoothing", value: "none" },
    { prop: "text-rendering", value: "optimizeSpeed" },
  ],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SoR Wiki",
    default: "SoR Wiki",
    absolute: "SoR Wiki",
  },
  description: "A Streets of Rogue wiki.",
  applicationName: "SoR Wiki",
  authors: [{ name: "Abbysssal", url: "/user/Abbysssal" }],
  openGraph: {
    type: "website",
    title: "SoR Wiki",
    siteName: "SoR Wiki",
    description: "A Streets of Rogue wiki.",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoR Wiki",
    description: "A Streets of Rogue wiki.",
    images: ["/logo.png"],
  },
  generator: "Next.js",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#fbb946",
};

if (process.env.NODE_ENV === "development") {
  metadata.metadataBase = new URL("http://localhost:3000");
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className} suppressHydrationWarning>
      <body>
        <ApiProvider>
          <ScrollControllerProvider>
            <CustomSearchParamsProvider>
              <WikiLayout>{children}</WikiLayout>
            </CustomSearchParamsProvider>
          </ScrollControllerProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
