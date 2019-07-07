import { vsprintf } from "sprintf-js";
import * as utils from "utils/utils";

import { encodeKey } from "./resource";

const getResources = (function () {
  let resources = null;
  return function () {
    if (resources === null) {
      resources = utils.ad.getApplicationContext().getResources();
    }
    return resources;
  };
})();

export function localize(key: string, ...args: string[]): string {
  let localizedString;
  try {
    const identifier = utils.ad.resources.getStringId(encodeKey(key));
    localizedString = identifier === 0 ? key : getResources().getString(identifier);
  } catch (error) {
    localizedString = key;
  }
  return vsprintf(localizedString, args);
}

export function overrideLocale(locale: string): boolean {
  console.log("overrideLocale is not (yet) implemented on Android");
  return false;
}
