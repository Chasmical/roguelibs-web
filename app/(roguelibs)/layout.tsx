import type { Metadata } from "next";
import localFont from "next/font/local";
import "../global.scss";
import MainLayout from "@components/Common/MainLayout";

const munroFont = localFont({
  src: "../Munro.woff2",
  display: "swap",
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
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className}>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
