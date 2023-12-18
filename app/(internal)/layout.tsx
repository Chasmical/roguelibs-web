export { metadata } from "@app/(roguelibs)/layout";
import localFont from "next/font/local";
import "../global.scss";
import "./index.scss";

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

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className} suppressHydrationWarning>
      <body>
        <div className="markdown">{children}</div>
      </body>
    </html>
  );
}
