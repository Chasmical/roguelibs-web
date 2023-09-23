import fs from "fs";
import Path from "path";

export function findDirectoryWithTarget(startPath: string, target: string) {
  const parts = Path.normalize(startPath)
    .split(/[\\|/]/)
    .filter(Boolean);

  while (parts.length) {
    const path = parts.join(Path.sep) + Path.sep + target;
    if (fs.existsSync(path)) return parts.join("/");
    parts.pop();
  }

  return null;
}
