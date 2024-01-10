import { forwardRef } from "react";
import NextLink from "next/link";
import styles from "./index.module.scss";
import clsx from "clsx";

type NextLinkProps = React.ComponentProps<typeof NextLink>;

export interface LinkProps extends Omit<NextLinkProps, "href"> {
  href?: string;
  underline?: boolean;
  blank?: boolean;
}

const Link = forwardRef(function Link(
  { href, className, underline, blank, children, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  className = clsx(styles.link, (underline ?? true) && styles.underline, className);

  if (!href) {
    return (
      <span ref={ref} className={className} {...props}>
        {children}
      </span>
    );
  }

  return (
    <NextLink
      ref={ref}
      className={className}
      href={href}
      target={blank ?? href.startsWith("http") ? "_blank" : undefined}
      {...props}
    >
      {children}
    </NextLink>
  );
});

export default Link;
