/// <reference path="./before-prepare.d.ts" />

import * as fs from "fs";
import * as path from "path";
import * as plist from "simple-plist";

import * as common from "./before-prepare.common";

import { replace } from "../sources/resource.common";
import { encodeKey, encodeValue } from "../sources/resource.ios";

export function cleanResourcesFiles(appResourcesDir: string, supportedLanguages: Map<string, boolean>) {
  const platformResourcesDir = path.join(appResourcesDir, "iOS");
  fs.readdirSync(platformResourcesDir).filter(fileName => {
    const match = /^(.+)\.lproj$/.exec(fileName);
    return match && !supportedLanguages.has(match[1]);
  }).map(fileName => {
    return path.join(platformResourcesDir, fileName);
  }).filter(filePath => {
    return fs.statSync(filePath).isDirectory();
  }).forEach(lngResourcesDir => {
    ["InfoPlist.strings", "Localizable.strings"].forEach(filePath => {
      common.removeFile(path.join(lngResourcesDir, filePath))
    });
    common.removeDirectoryIfEmpty(lngResourcesDir);
  });
}

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
  common.createDirectoryIfNeeded(lngResourcesDir);
  writeLocalizableStrings(lngResourcesDir, localizableStrings);
  writeInfoPlistStrings(lngResourcesDir, infoPlistStrings);
  if (isDefaultLanguage) {
    const infoPlistValues = infoPlistStrings.slice();
    infoPlistValues.push({ key: "CFBundleDevelopmentRegion", value: language });
    writeInfoPlist(appResourcesDir, infoPlistValues);
  }
}

function writeLocalizableStrings(lngResourcesDir: string, localizableStrings: I18nEntry[]) {
  let strings = "";
  for (const { key, value } of localizableStrings) {
    strings += `"${encodeKey(key)}" = "${encodeValue(value)}";\n`;
  }
  const resourceFilePath = path.join(lngResourcesDir, "Localizable.strings");
  common.writeFileSyncIfNeeded(resourceFilePath, strings, "utf-16");
}

function writeInfoPlistStrings(lngResourcesDir: string, infoPlistStrings: I18nEntry[]) {
  let strings = "";
  for (const { key, value } of infoPlistStrings) {
    strings += `"${encodeKey(key)}" = "${encodeValue(value)}";\n`;
  }
  const resourceFilePath = path.join(lngResourcesDir, "InfoPlist.strings");
  common.writeFileSyncIfNeeded(resourceFilePath, strings, "utf-16");
}

function writeInfoPlist(appResourcesDir: string, infoPlistValues: I18nEntry[]) {
  const resourceFilePath = path.join(appResourcesDir, "iOS", "Info.plist");
  const data = plist.readFileSync(resourceFilePath);
  let hasNewValue = false;
  for (const { key, value } of infoPlistValues) {
    if (!data.hasOwnProperty(key) || data[key] != value) {
      data[key] = value;
      hasNewValue = true;
    }
  }
  hasNewValue && plist.writeFileSync(resourceFilePath, data);
}
