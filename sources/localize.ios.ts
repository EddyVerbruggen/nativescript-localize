import * as format from "format";
import { encodeKey } from "./resource";
import * as utils from "utils/utils";

const bundle = utils.ios.getter(NSBundle, NSBundle.mainBundle);

export function localize(key: string, ...args: string[]): string {
	const localizedString = bundle.localizedStringForKeyValueTable(encodeKey(key), key, null);
	return format(...[localizedString, ...args]);
}
