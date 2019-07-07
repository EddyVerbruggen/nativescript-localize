import { vsprintf } from "sprintf-js";

import { convertAtSignToStringSign } from "./placeholder";
import { encodeKey } from "./resource";

let bundle;

const getBundle = (function () {
  return function () {
    if (!bundle) {
      bundle = NSBundle.mainBundle;
    }
    return bundle;
  };
})();

export function localize(key: string, ...args: string[]): string {
  const localizedString = getBundle().localizedStringForKeyValueTable(encodeKey(key), key, null);
  return vsprintf(convertAtSignToStringSign(localizedString), args);
}

export function overrideLocale(locale: string): boolean {
  const path = NSBundle.mainBundle.pathForResourceOfType(locale.substring(0, 2), "lproj");

  if (!path) {
    return false;
  }

  bundle = NSBundle.bundleWithPath(path);
  NSUserDefaults.standardUserDefaults.setObjectForKey([locale], "AppleLanguages");
  NSUserDefaults.standardUserDefaults.synchronize();
  return true;
}
