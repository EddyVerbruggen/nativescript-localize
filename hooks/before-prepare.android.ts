/// <reference path="./before-prepare.d.ts" />

import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { encodeKey, encodeValue } from "../sources/resource.android";

export function cleanResourcesFiles(appResourcesDir: string) {
  const platformResourcesDir = path.join(appResourcesDir, "Android");
  fs.readdirSync(platformResourcesDir).filter(fileName => {
    return fileName.match(/^values(?:-|$)/);
  }).map(fileName => {
    return path.join(platformResourcesDir, fileName);
  }).filter(filePath => {
    return fs.statSync(filePath).isDirectory();
  }).forEach(lngResourcesDir => {
    try {
      const resourceFilePath = path.join(lngResourcesDir, "strings.xml");
      fs.unlinkSync(resourceFilePath);
    } catch (error) {
    }
    try {
      fs.rmdirSync(lngResourcesDir);
    } catch (error) {
    }
  });
}

export function createResourcesFiles(
  appResourcesDir: string,
  language: string,
  isDefaultLanguage: boolean,
  i18nContentIterator: Iterable<I18nEntry>
) {
  const lngResourcesDir = path.join(appResourcesDir, "Android", "values" + (isDefaultLanguage ? "" : `-${language}`));
  fs.existsSync(lngResourcesDir) || mkdirp.sync(lngResourcesDir);
  const resourceFilePath = path.join(lngResourcesDir, "strings.xml");
  const stream = fs.createWriteStream(resourceFilePath);
  stream.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
  stream.write("<resources>\n");
  for (const { key, value } of i18nContentIterator) {
    const encodedKey = encodeKey(key);
    const encodedValue = encodeValue(value);
    stream.write(`  <string name="${encodedKey}">${encodedValue}</string>\n`);
    if (key === "app.name") {
      stream.write(`  <string name="app_name">${encodedValue}</string>\n`);
      stream.write(`  <string name="title_activity_kimera">${encodedValue}</string>\n`);
    }
  }
  stream.write("</resources>\n");
  stream.end();
}
