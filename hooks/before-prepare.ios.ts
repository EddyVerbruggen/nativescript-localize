/// <reference path="./before-prepare.d.ts" />

import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as plist from "simple-plist";

import { replace } from "../sources/resource.common";
import { encodeKey, encodeValue } from "../sources/resource.ios";

export function createResourcesFiles(
  appResourcesDir: string,
  language: string,
  isDefaultLanguage: boolean,
  i18nContentIterator: Iterable<I18nEntry>
) {
  const localizableStrings: I18nEntry[] = [];
  const infoPlistStrings: I18nEntry[] = [];
  for (const { key, value } of i18nContentIterator) {
    localizableStrings.push({ key, value });
    if (key === "app.name") {
      infoPlistStrings.push({ key: "CFBundleDisplayName", value });
      infoPlistStrings.push({ key: "CFBundleName", value });
    } else if (key.startsWith("ios.info.plist.")) {
      infoPlistStrings.push({ key: key.substr(15), value });
    }
  }
  const lngResourcesDir = path.join(appResourcesDir, "iOS", `${language}.lproj`);
  fs.existsSync(lngResourcesDir) || mkdirp.sync(lngResourcesDir);
  writeLocalizableStrings(lngResourcesDir, localizableStrings);
  writeInfoPlistStrings(lngResourcesDir, infoPlistStrings);
  if (isDefaultLanguage) {
    const infoPlistValues = infoPlistStrings.slice();
    infoPlistValues.push({ key: "CFBundleDevelopmentRegion", value: language });
    writeInfoPlist(appResourcesDir, infoPlistValues);
  }
}

function writeLocalizableStrings(lngResourcesDir: string, localizableStrings: I18nEntry[]) {
  const resourceFilePath = path.join(lngResourcesDir, "Localizable.strings");
  const stream = fs.createWriteStream(resourceFilePath);
  for (const { key, value } of localizableStrings) {
    stream.write(`"${encodeKey(key)}" = "${encodeValue(value)}";\n`);
  }
  stream.end();
}

function writeInfoPlistStrings(lngResourcesDir: string, infoPlistStrings: I18nEntry[]) {
  const resourceFilePath = path.join(lngResourcesDir, "InfoPlist.strings");
  const stream = fs.createWriteStream(resourceFilePath);
  for (const { key, value } of infoPlistStrings) {
    stream.write(`"${encodeKey(key)}" = "${encodeValue(value)}";\n`);
  }
  stream.end();
}

function writeInfoPlist(appResourcesDir: string, infoPlistValues: I18nEntry[]) {
  const resourceFilePath = path.join(appResourcesDir, "iOS", "Info.plist");
  const data = plist.readFileSync(resourceFilePath);
  for (const { key, value } of infoPlistValues) {
    data[key] = value;
  }
  plist.writeFileSync(resourceFilePath, data);
}
