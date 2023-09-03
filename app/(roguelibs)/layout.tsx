import MainLayout from "@components/MainLayout";
import type { Metadata } from "next";
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
    template: "%s | RogueLibs Web",
    default: "RogueLibs Web",
    absolute: "RogueLibs Web",
  },
  description: "A mod-sharing platform for Streets of Rogue.",
  applicationName: "RogueLibs Web",
  authors: [{ name: "Abbysssal", url: "/users/Abbysssal" }],
  openGraph: {
    type: "website",
    title: "RogueLibs Web",
    siteName: "RogueLibs Web",
    description: "A mod-sharing platform for Streets of Rogue.",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "RogueLibs Web",
    description: "A mod-sharing platform for Streets of Rogue.",
    images: ["/logo.png"],
  },
  colorScheme: "dark",
  themeColor: "#fbb946",
  generator: "Next.js",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className} suppressHydrationWarning>
      <body>
        <ApiProvider>
          <MainLayout>{children}</MainLayout>
        </ApiProvider>
      </body>
    </html>
  );
}
