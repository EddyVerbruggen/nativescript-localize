import { replace } from "./resource.common";

const Hashes = require("jshashes");
const SHA1 = new Hashes.SHA1;

export function encodeKey(key: string): string {
  return "_" + SHA1.hex(key);
}

export function encodeValue(value: string): string {
  return '"' + replace(['"', "\\"], ['\\"', "\\\\"], value) + '"';
}
