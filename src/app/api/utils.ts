import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
export const moveDir = path.join(projectRoot, "move");

export function createMoveDir() {
  if (!fs.existsSync(moveDir)) {
    fs.mkdirSync(moveDir);
  }
}
