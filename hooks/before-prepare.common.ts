import * as fs from "fs";
import * as mkdirp from "mkdirp";

export function createDirectoryIfNeeded(directoryPath: string): void {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    mkdirp.sync(directoryPath);
  }
}

export function removeDirectoryIfEmpty(directoryPath: string): void {
  try {
    fs.rmdirSync(directoryPath);
  } catch (error) {
  }
}

export function removeFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
  }
}

export function writeFileSyncIfNeeded(filePath: string, content: string): void {
  try {
    const oldContent = fs.readFileSync(filePath, "utf8");
    if (oldContent == content) { return; }
  } catch (error) {
  }
  fs.writeFileSync(filePath, content, { encoding: "utf8" });
}
