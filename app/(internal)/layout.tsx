import { munroFont } from "@app/(roguelibs)/layout";
export { metadata } from "@app/(roguelibs)/layout";
import "../global.scss";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className} suppressHydrationWarning>
      <body style={{ background: "var(--color-background)" }}>
        <div className="markdown">{children}</div>
      </body>
    </html>
  );
}
