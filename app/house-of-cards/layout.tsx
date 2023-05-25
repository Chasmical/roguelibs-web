import type { Metadata } from "next";
import localFont from "next/font/local";
import "../global.scss";

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
    template: "%s | SoR: House of Cards",
    default: "SoR: House of Cards",
    absolute: "SoR: House of Cards",
  },
  description: "A yet another SoR-themed card-based game.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className}>
      <body>{children}</body>
    </html>
  );
}
