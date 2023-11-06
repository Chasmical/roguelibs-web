import { munroFont } from "@app/(roguelibs)/layout";
export { metadata } from "@app/(roguelibs)/layout";
import "../global.scss";
import "./index.scss";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={munroFont.className} suppressHydrationWarning>
      <body>
        <div className="markdown">{children}</div>
      </body>
    </html>
  );
}
