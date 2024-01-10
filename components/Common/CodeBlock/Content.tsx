"use client";
import { lazy, memo } from "react";
import type { HighlightProps } from "prism-react-renderer";
import type { CodeBlockProps } from ".";
import CodeBlockWrapper from "./Wrapper";
import styles from "./index.module.scss";
import clsx from "clsx";

const Highlight = lazy(() => import("prism-react-renderer").then(m => ({ default: m.Highlight })));

export interface CodeBlockContentProps extends Pick<CodeBlockProps, "wrap" | "nocopy" | "nonums"> {
  code: string;
  language: string | null;
}

const CodeBlockContent = memo(function CodeBlockContent({
  code,
  language,
  wrap,
  nocopy,
  nonums,
}: CodeBlockContentProps) {
  const render: HighlightProps["children"] = ({ className, style, tokens, getLineProps, getTokenProps }) => (
    <div className={styles.contents}>
      <CodeBlockWrapper className={className} style={style} nocopy={nocopy} code={code}>
        <code className={clsx(styles.code, wrap && styles.wrap, nonums || styles.withLineNumbers)}>
          {tokens.map((line, index) => (
            <span key={index} className={styles.line}>
              {nonums || <span className={styles.lineNumber} />}
              <span {...getLineProps({ line })}>
                {line.map((token, index) => {
                  return <span key={index} {...getTokenProps({ token })} />;
                })}
              </span>
            </span>
          ))}
        </code>
      </CodeBlockWrapper>
    </div>
  );

  if (language) {
    return (
      <Highlight code={code} language={language}>
        {render}
      </Highlight>
    );
  }

  return render({
    className: "",
    style: {},
    tokens: code.split("\n").map(t => [{ content: t, types: [] }]),
    getLineProps: () => undefined!,
    getTokenProps: ({ token }) => ({ children: token.content }) as any,
  });
});

export default CodeBlockContent;
