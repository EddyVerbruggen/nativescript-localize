import * as fs from "fs";
import * as path from "path";

import { ConverterCommon, I18nEntry, SupportedLanguages } from "./converter.common";
import { encodeKey, encodeValue } from "../src/resource.android";

export class ConverterAndroid extends ConverterCommon {
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
      const resourceChanged = this.removeFileIfExists(resourceFilePath);
      if (this.removeDirectoryIfEmpty(lngResourcesDir) || resourceChanged) {
        this.emit(ConverterCommon.RESOURCE_CHANGED_EVENT);
      }
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
    if (this.writeFileSyncIfNeeded(resourceFilePath, strings)) {
      this.emit(ConverterCommon.RESOURCE_CHANGED_EVENT);
    }
    return this;
  }

  public livesyncExclusionPatterns(): string[] {
    return [
      path.join(this.appResourcesDirectoryPath, "values", "strings.xml"),
      path.join(this.appResourcesDirectoryPath, "values-*", "strings.xml"),
    ];
  }
}
