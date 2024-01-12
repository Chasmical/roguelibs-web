"use client";
import { lazy, memo } from "react";
import type { HighlightProps, Token } from "prism-react-renderer";
import type { CodeBlockProps } from ".";
import CodeBlockWrapper from "./Wrapper";
import styles from "./index.module.scss";

const Highlight = lazy(() => import("prism-react-renderer").then(m => ({ default: m.Highlight })));

export interface CodeBlockContentProps extends Pick<CodeBlockProps, "wrap" | "nocopy" | "nonums"> {
  code: string;
  language: string | null;
}

const CodeBlockContent = memo(function CodeBlockContent({ code, language, ...props }: CodeBlockContentProps) {
  const render: HighlightProps["children"] = ({ className, style, tokens, getLineProps, getTokenProps }) => {
    const mapToken = (token: Token, index: number) => {
      return <span key={index} {...getTokenProps({ token })} />;
    };
    const mapLine: (line: Token[], index: number) => React.ReactNode = props.nonums
      ? (line, index) => (
          <span key={index} {...getLineProps({ line })}>
            {line.map(mapToken)}
          </span>
        )
      : (line, index) => (
          <span key={index} className={styles.line}>
            <span className={styles.lineNumber} />
            <span {...getLineProps({ line })}>{line.map(mapToken)}</span>
          </span>
        );

    return (
      <div className={styles.contents}>
        <CodeBlockWrapper className={className} style={style} code={code} {...props}>
          {tokens.map(mapLine)}
        </CodeBlockWrapper>
      </div>
    );
  };

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
