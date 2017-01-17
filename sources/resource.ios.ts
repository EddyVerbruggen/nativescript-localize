import { replace } from "./resource.common";

export function encodeKey(key: string): string {
  return encodeValue(key);
}

export function encodeValue(value: string): string {
  return replace(['"', "\\"], ['\\"', "\\\\"], value);
}
