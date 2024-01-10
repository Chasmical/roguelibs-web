"use client";
import ReactSkeleton, { SkeletonProps as ReactSkeletonProps } from "react-loading-skeleton";
import styles from "./index.module.scss";
import clsx from "clsx";
import "./index.scss";

export interface SkeletonProps extends ReactSkeletonProps {}

export default function Skeleton({ ...props }: SkeletonProps) {
  props.containerClassName = clsx(props.count != null && styles.flex, props.containerClassName);
  return ReactSkeleton(props);
}
