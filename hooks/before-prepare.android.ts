/// <reference path="./before-prepare.d.ts" />

import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";

import * as common from "./before-prepare.common";

import { encodeKey, encodeValue } from "../sources/resource.android";

export function cleanResourcesFiles(appResourcesDir: string, supportedLanguages: Map<string, boolean>) {
  const platformResourcesDir = path.join(appResourcesDir, "Android");
  fs.readdirSync(platformResourcesDir).filter(fileName => {
    const match = /^values(?:-(.+))?$/.exec(fileName);
    if (!match) {
      return false;
    } else if (match[1]) {
      return !supportedLanguages.has(match[1]);
    } else {
      for (const [language, isDefaultLanguage] of supportedLanguages) {
        if (isDefaultLanguage) { return false; }
      }
      return true;
    }
  }).map(fileName => {
    return path.join(platformResourcesDir, fileName);
  }).filter(filePath => {
    return fs.statSync(filePath).isDirectory();
  }).forEach(lngResourcesDir => {
    common.removeFile(path.join(lngResourcesDir, "strings.xml"));
    common.removeDirectoryIfEmpty(lngResourcesDir);
  });
}

export function createResourcesFiles(
  appResourcesDir: string,
  language: string,
  isDefaultLanguage: boolean,
  i18nContentIterator: Iterable<I18nEntry>
) {
  const lngResourcesDir = path.join(appResourcesDir, "Android", "values" + (isDefaultLanguage ? "" : `-${language}`));
  common.createDirectoryIfNeeded(lngResourcesDir);
  let strings = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
  strings += "<resources>\n";
  for (const { key, value } of i18nContentIterator) {
    const encodedKey = encodeKey(key);
    const encodedValue = encodeValue(value);
    strings += `  <string name="${encodedKey}">${encodedValue}</string>\n`;
    if (key === "app.name") {
      strings += `  <string name="app_name">${encodedValue}</string>\n`;
      strings += `  <string name="title_activity_kimera">${encodedValue}</string>\n`;
    }
  }
  strings += "</resources>\n";
  const resourceFilePath = path.join(lngResourcesDir, "strings.xml");
  common.writeFileSyncIfNeeded(resourceFilePath, strings);
}
