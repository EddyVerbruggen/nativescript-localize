import * as format from "format";
import { encodeKey } from "./resource";
import * as utils from "utils/utils";

const resources = utils.ad.getApplicationContext().getResources();

export function localize(key: string, ...args: string[]): string {
	const identifier = utils.ad.resources.getStringId(encodeKey(key));
	const localizedString = identifier === 0 ? key : resources.getString(identifier);
	return format(...[localizedString, ...args]);
};
