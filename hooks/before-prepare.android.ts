import * as fs from "fs";
import * as path from "path";

import { BeforePrepareCommon, I18nEntry, SupportedLanguages } from "./before-prepare.common";

import { encodeKey, encodeValue } from "../sources/resource.android";

export class BeforePrepareAndroid extends BeforePrepareCommon {
  protected cleanObsoleteResourcesFiles(resourcesDirectory: string, supportedLanguages: SupportedLanguages): this {
    fs.readdirSync(resourcesDirectory).filter(fileName => {
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
      return path.join(resourcesDirectory, fileName);
    }).filter(filePath => {
      return fs.statSync(filePath).isDirectory();
    }).forEach(lngResourcesDir => {
      const resourceFilePath = path.join(lngResourcesDir, "strings.xml");
      this.removeFileIfExists(resourceFilePath);
      this.removeDirectoryIfEmpty(lngResourcesDir);
    });
    return this;
  }

  protected createLanguageResourcesFiles(
    language: string,
    isDefaultLanguage: boolean,
    i18nContentIterator: Iterable<I18nEntry>
  ): this {
    const languageResourcesDir = path.join(
      this.appResourcesDirectoryPath,
      `values${isDefaultLanguage ? "" : `-${language}`}`
    );
    this.createDirectoryIfNeeded(languageResourcesDir);
    let strings = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n";
    for (const { key, value } of i18nContentIterator) {
      const encodedKey = encodeKey(key);
      const encodedValue = encodeValue(value);
      strings += `  <string formatted="false" name="${encodedKey}">${encodedValue}</string>\n`;
      if (key === "app.name") {
        strings += `  <string formatted="false" name="app_name">${encodedValue}</string>\n`;
        strings += `  <string formatted="false" name="title_activity_kimera">${encodedValue}</string>\n`;
      }
    }
    strings += "</resources>\n";
    const resourceFilePath = path.join(languageResourcesDir, "strings.xml");
    this.writeFileSyncIfNeeded(resourceFilePath, strings);
    return this;
  }
}
