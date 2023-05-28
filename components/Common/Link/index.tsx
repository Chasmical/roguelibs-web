import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ForwardedRef, forwardRef } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface LinkProps extends Omit<NextLinkProps, "href"> {
  href?: string;
  className?: string;
  underline?: boolean;
  blank?: boolean;
  children?: React.ReactNode;
  // ...props
  style?: React.CSSProperties;
}

const Link = forwardRef(function Link(
  { href, className, underline = true, blank, children, ...props }: LinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  className = clsx(styles.link, underline && styles.underline, className);

  if (!href) {
    return (
      <span ref={ref} className={className} {...props}>
        {children}
      </span>
    );
  }

  if (blank === undefined) blank = href.startsWith("http");
  if (typeof children === "string") children = <span>{children}</span>;

  return (
    <NextLink ref={ref} className={className} href={href} target={blank ? "_blank" : undefined} {...props}>
      {children}
    </NextLink>
  );
});

export default Link;
