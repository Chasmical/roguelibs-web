"use client";
import ReactSkeleton, { SkeletonProps as ReactSkeletonProps } from "react-loading-skeleton";
import "./index.scss";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface SkeletonProps extends ReactSkeletonProps {
  button?: boolean;
  round?: boolean;
}

export default function Skeleton({ ...props }: SkeletonProps) {
  if (props.circle) props.height ??= props.width ??= props.height;
  if (props.count != null) props.containerClassName = clsx(props.containerClassName, styles.flex);
  if (props.round) props.className = clsx(props.className, styles.round);
  if (props.button) props.className = clsx(props.className, styles.button);
  return ReactSkeleton(props);
}
