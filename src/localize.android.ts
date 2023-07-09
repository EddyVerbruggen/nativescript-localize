import { vsprintf } from "sprintf-js";
import { android as _android } from "tns-core-modules/application";
import { getString, setString } from "tns-core-modules/application-settings";
import { isAndroid } from "tns-core-modules/platform";
import * as utils from "tns-core-modules/utils/utils";

import { encodeKey } from "./resource";

declare var java: any;

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

export function androidLaunchEventLocalizationHandler() {
  const lang = getString("__app__language__", 'none');
  if (lang !== 'none' && isAndroid) {
    const locale = new java.util.Locale(lang);
    java.util.Locale.setDefault(locale);

    const resources = _android.context.getResources();
    const configuration = resources.getConfiguration();
    configuration.locale = locale;

    resources.updateConfiguration(configuration, resources.getDisplayMetrics());
  }
}

export function overrideLocale(locale: string): boolean {
  let language_code = locale.substring(0, 2)
  if (locale.indexOf('-') < 0 && locale.length == 3) {
    language_code = locale
  }

  setString("__app__language__", language_code);
  return true;
}
