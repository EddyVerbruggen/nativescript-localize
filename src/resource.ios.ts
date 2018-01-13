import { convertStringSignToAtSign, convertPlaceholders } from "./placeholder";
import { encodeKey, replace } from "./resource.common";

export { encodeKey };

export function encodeValue(value: string): string {
  return replace(
    ['"', "\\", "\n", "\r", "\t"],
    ['\\"', "\\\\", "\\n", "\\r", "\\t"],
    convertStringSignToAtSign(convertPlaceholders(value))
  );
}
