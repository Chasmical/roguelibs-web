"use client";
import { Children, useEffect, useMemo, useState } from "react";
import CodeBlockContent from "./Content";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  lang?: string;
  wrap?: boolean;
  nocopy?: boolean;
  nonums?: boolean;
}

export default function CodeBlock({
  title,
  lang,
  wrap,
  nocopy,
  nonums,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const code = useMemo(() => stringifyChildren(children).join("\n"), [children]);
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    try {
      lang = langAliases[lang!] ?? lang;
      if (lang) {
        (async () => {
          window.Prism = (await import("prism-react-renderer")).Prism;
          await import(`prismjs/components/prism-${lang}.min.js`);
          setLanguage(lang);
        })();
      }
    } catch (err) {
      console.error(`"${lang}" is not a valid PrismJS language.`);
      setLanguage(null);
    }
  }, [lang]);

  return (
    <div role="panel" className={clsx(styles.block, className)} {...props}>
      {title && <div className={styles.title}>{title}</div>}
      <CodeBlockContent code={code} language={language} wrap={wrap} nocopy={nocopy} nonums={nonums} />
    </div>
  );
}

function stringifyChildren(children: any, results: string[] = []) {
  for (const child of Children.toArray(children)) {
    if (typeof child !== "boolean" && child != null) {
      if ((child as any).type === "code") {
        stringifyChildren((child as any).props.children, results);
      } else {
        results.push(...("" + child).split("\n"));
      }
    }
  }
  if (results.length > 1 && !results.at(-1)) results.pop();
  return results;
}

const langAliases: Record<string, string | undefined> = {
  js: "javascript",
  ts: "typescript",
  cs: "csharp",
  sln: "markup",
  csproj: "markup",
  url: "uri",
  xml: "markup",
  html: "markup",
  svg: "markup",
  yml: "yaml",
  md: "markdown",
  mdx: "markdown",
  sh: "bash",
  shell: "bash",
  ps: "powershell",
  py: "python",
};
