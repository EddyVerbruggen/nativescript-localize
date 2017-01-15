export function replace(find: string[], replace: string[], string: string): string {
  return string.replace(
    new RegExp("(" + find.map(i => i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")).join("|") + ")", "g"),
    match => replace[find.indexOf(match)]
  );
}
