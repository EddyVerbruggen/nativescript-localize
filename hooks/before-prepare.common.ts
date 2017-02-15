import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";

import { EventEmitter } from "events";

export abstract class BeforePrepareCommon extends EventEmitter {
  public static readonly CONFIGURATION_CHANGED_EVENT = "configurationChangedEvent";
  public static readonly RESOURCE_CHANGED_EVENT = "resourceChangedEvent";

  protected readonly appResourcesDirectoryPath: string;
  protected readonly appResourcesDestinationDirectoryPath: string;
  protected readonly i18nDirectoryPath: string;

  public constructor(
    protected logger: ILogger,
    protected platformData: IPlatformData,
    protected projectData: IProjectData
  ) {
    super();
    this.appResourcesDirectoryPath = path.join(projectData.appResourcesDirectoryPath, platformData.normalizedPlatformName);
    this.appResourcesDestinationDirectoryPath = platformData.platformProjectService.getAppResourcesDestinationDirectoryPath();
    this.i18nDirectoryPath = path.join(projectData.projectDir, "app", "i18n");
  }

  protected abstract cleanObsoleteResourcesFiles(
    resourcesDirectory: string,
    supportedLanguages: SupportedLanguages
  ): this;

  protected abstract createLanguageResourcesFiles(
    language: string,
    isDefaultLanguage: boolean,
    i18nContentIterator: Iterable<I18nEntry>
  ): this;

  public run(): this {
	  if (!fs.existsSync(this.i18nDirectoryPath)) {
      this.logger.info(`'${this.i18nDirectoryPath}' doesn't exists: nothing to localize`);
      return this;
    }

    const supportedLanguages: SupportedLanguages = new Map();

    fs.readdirSync(this.i18nDirectoryPath).map(fileName => {
      return path.join(this.i18nDirectoryPath, fileName);
    }).filter(filePath => {
      return fs.statSync(filePath).isFile();
    }).map(filePath => {
      delete (<any>require).cache[(<any>require).resolve(filePath)];
      return filePath;
    }).map(filePath => {
      let language = path.basename(filePath, path.extname(filePath));
      const isDefaultLanguage = path.extname(language) === ".default";
      if (isDefaultLanguage) { language = path.basename(language, ".default"); }
      supportedLanguages.set(language, isDefaultLanguage);
      this.createLanguageResourcesFiles(
        language,
        isDefaultLanguage,
        this.i18nContentGenerator(require(filePath))
      );
    });

    [this.appResourcesDirectoryPath, this.appResourcesDestinationDirectoryPath].forEach(resourcesDirectoryPath => {
      if (fs.existsSync(resourcesDirectoryPath) && fs.statSync(resourcesDirectoryPath).isDirectory()) {
        this.cleanObsoleteResourcesFiles(resourcesDirectoryPath, supportedLanguages);
      }
    });

    return this;
  }

  public * i18nContentGenerator(i18nContent: any): Iterable<I18nEntry> {
    const stack = [{ prefix: "", element: i18nContent }];
    while (stack.length > 0) {
      const { prefix, element } = stack.pop();
      if (Array.isArray(element)) {
        yield { key: prefix, value: element.join("") };
      } else if (typeof element === "object") {
        for (const key of Object.keys(element)) {
          stack.push({ prefix: prefix === "" ? key : `${prefix}.${key}`, element: element[key] });
        }
      } else {
        yield { key: <string>prefix, value: new String(element).valueOf() };
      }
    }
  }

  protected createDirectoryIfNeeded(directoryPath: string): this {
    if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) { mkdirp.sync(directoryPath); }
    return this;
  }

  protected removeDirectoryIfEmpty(directoryPath: string): this {
    try { fs.rmdirSync(directoryPath); }
    catch (error) {}
    return this;
  }

  protected removeFile(filePath: string): boolean {
    try { fs.unlinkSync(filePath); }
    catch (error) {
      return false;
    }
    return true;
  }

  protected writeFileSyncIfNeeded(filePath: string, content: string): boolean {
    try { if (content == fs.readFileSync(filePath, "utf8")) { return false; } }
    catch (error) {}
    fs.writeFileSync(filePath, content, { encoding: "utf8" });
    return true;
  }
}

export type I18nEntry = { key: string; value: string; }
export type SupportedLanguages = Map<string, boolean>;
