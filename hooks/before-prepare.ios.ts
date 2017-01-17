/// <reference path="./before-prepare.d.ts" />

import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { replace } from "../sources/resource.common";
import { encodeKey, encodeValue } from "../sources/resource.ios";

export function createResourceFile(
  appResourcesDir: string,
  language: string,
  isDefaultLanguage: boolean,
  i18nContentIterator: Iterable<I18nEntry>
) {
  const lngResourcesDir = path.join(appResourcesDir, "iOS", `${language}.lproj`);
  fs.existsSync(lngResourcesDir) || mkdirp.sync(lngResourcesDir);
  const resourceFilePath = path.join(lngResourcesDir, "Localizable.strings");
	const stream = fs.createWriteStream(resourceFilePath);
	for (const { key, value } of i18nContentIterator) {
		const encodedKey = encodeKey(key);
		const encodedValue = encodeValue(value);
		stream.write(`"${encodedKey}" = "${encodedValue}";\n`);
		if (key === "app.name") {
      writeAppNameToInfoPlistStrings(lngResourcesDir, encodedValue);
      if (isDefaultLanguage) {
        writeFallbackAppNameToInfoPlist(appResourcesDir, value);
      }
		}
	}
	stream.end();
	if (isDefaultLanguage) {
    writeDefaultLanguageToInfoPlist(appResourcesDir, language);
	}
}

function writeAppNameToInfoPlistStrings(lngResourcesDir: string, encodedAppName: string) {
  const infoPlistStringsFilePath = path.join(lngResourcesDir, "InfoPlist.strings");
  let infoPlistStringsContent = readFileSync(infoPlistStringsFilePath);
  for (const key of ["CFBundleDisplayName", "CFBundleName"]) {
    const pattern = new RegExp(`^(\\s*?"?${key}"?\\s*?=)\\s*?"?.*?"?\\s*?;\\s*?$`, "gm");
    if (infoPlistStringsContent.match(pattern)) {
      infoPlistStringsContent = infoPlistStringsContent.replace(pattern, `$1 "${encodedAppName}";`);
    } else {
      infoPlistStringsContent += `\n"${key}" = "${encodedAppName}";\n`;
    }
  }
  fs.writeFileSync(infoPlistStringsFilePath, infoPlistStringsContent);
}

function writeFallbackAppNameToInfoPlist(appResourcesDir: string, appName: string) {
  const encodedAppName = replace(["<", "&"], ["&lt;", "&amp;"], appName);
  const infoPlistFilePath = path.join(appResourcesDir, "iOS", "Info.plist");
  let infoPlistContent = readFileSync(infoPlistFilePath);
  infoPlistContent = infoPlistContent.replace(
    /(<key>CFBundleDisplayName<\/key>\s*<string>).*?(<\/string>)/, `$1${encodedAppName}$2`
  );
  infoPlistContent = infoPlistContent.replace(
    /(<key>CFBundleName<\/key>\s*<string>).*?(<\/string>)/, `$1${encodedAppName}$2`
  );
  fs.writeFileSync(infoPlistFilePath, infoPlistContent);
}

function writeDefaultLanguageToInfoPlist(appResourcesDir: string, defaultLanguage: string) {
  const infoPlistFilePath = path.join(appResourcesDir, "iOS", "Info.plist");
  let infoPlistContent = readFileSync(infoPlistFilePath);
  infoPlistContent = infoPlistContent.replace(
    /(<key>CFBundleDevelopmentRegion<\/key>\s*<string>).*?(<\/string>)/, `$1${defaultLanguage}$2`
  );
  fs.writeFileSync(infoPlistFilePath, infoPlistContent);
}

function readFileSync(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return "";
  }
}
