import { vsprintf } from "sprintf-js";
import * as utils from "utils/utils";

import { convertAtSignToStringSign } from "./placeholder";
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
  return vsprintf(convertAtSignToStringSign(localizedString), args);
}
