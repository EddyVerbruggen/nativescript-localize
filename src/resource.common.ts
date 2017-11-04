const Hashes = require("jshashes");
const SHA1 = new Hashes.SHA1();

export function encodeKey(key: string): string {
  return "_" + SHA1.hex(key);
}

export function replace(find: string[], replace: string[], string: string): string {
  return string.replace(
    new RegExp("(" + find.map(i => i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")).join("|") + ")", "g"),
    match => replace[find.indexOf(match)]
  );
}
