import * as format from "format";
import * as utils from "utils/utils";

import { encodeKey } from "./resource";

const getBundle = (function () {
  let bundle = null;
  return function () {
    if (bundle === null) {
      bundle = utils.ios.getter(NSBundle, NSBundle.mainBundle);
    }
    return bundle;
  };
})();

export function localize(key: string, ...args: string[]): string {
  const localizedString = getBundle().localizedStringForKeyValueTable(encodeKey(key), key, null);
  return format(...[localizedString, ...args]);
}
