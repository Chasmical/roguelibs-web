import fs from "fs";
import Path from "path";

export function findDirectoryWithTarget(startPath: string, target: string) {
  const parts = Path.normalize(startPath).split(Path.sep);
  while (parts.length) {
    const path = parts.join(Path.sep) + Path.sep + target;
    if (fs.existsSync(path)) return parts.join(Path.sep);
    parts.pop();
  }
  return null;
}
