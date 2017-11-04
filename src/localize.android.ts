import * as format from "format";
import { encodeKey } from "./resource";
import * as utils from "utils/utils";

const resources = utils.ad.getApplicationContext().getResources();

export function localize(key: string, ...args: string[]): string {
  let localizedString;
  try {
    const identifier = utils.ad.resources.getStringId(encodeKey(key));
    localizedString = identifier === 0 ? key : resources.getString(identifier);
  } catch (error) {
    localizedString = key;
  }
  return format(...[localizedString, ...args]);
};
