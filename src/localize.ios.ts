import { vsprintf } from "sprintf-js";

import { convertAtSignToStringSign } from "./placeholder";
import { encodeKey } from "./resource";
import { setString } from "tns-core-modules/application-settings";

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

export function androidLaunchEventLocalizationHandler() {
  // dummy
}

export function overrideLocale(locale: string): boolean {
  const path = NSBundle.mainBundle.pathForResourceOfType(locale.substring(0, 2), "lproj");

  if (!path) {
    return false;
  }

  bundle = NSBundle.bundleWithPath(path);
  NSUserDefaults.standardUserDefaults.setObjectForKey([locale], "AppleLanguages");
  NSUserDefaults.standardUserDefaults.synchronize();
  setString('__app__language__', locale.substring(0, 2));

  return true;
}
