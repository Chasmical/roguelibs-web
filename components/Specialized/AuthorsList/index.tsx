import { DbReleaseAuthor } from "@lib/Database";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface AuthorsListProps {
  authors: DbReleaseAuthor[];
}
export default function AuthorsListProps({ authors }: AuthorsListProps) {}
