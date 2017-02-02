import * as fs from "fs";
import * as path from "path";

const supportedPlatforms = {
	"android": require("./before-prepare.android"),
	"ios": require("./before-prepare.ios")
};

export = function(logger: any, platformsData: any, projectData: any, hookArgs: any) {
	const platformName = hookArgs.platform.toLowerCase();
	const i18nDirectoryPath = path.join(projectData.projectDir, "app", "i18n");
	if (supportedPlatforms.hasOwnProperty(platformName) && fs.existsSync(i18nDirectoryPath)) {
		const appResourcesDir = projectData.appResourcesDirectoryPath;
		const supportedLanguages = createResourcesFiles(platformName, appResourcesDir, i18nDirectoryPath);
		cleanResourcesFiles(platformName, appResourcesDir, supportedLanguages);
	}
};

function cleanResourcesFiles(platformName: string, appResourcesDir: string, supportedLanguages: Map<string, boolean>) {
	supportedPlatforms[platformName].cleanResourcesFiles(appResourcesDir, supportedLanguages);
}

function createResourcesFiles(platformName: string, appResourcesDir: string, i18nDirectoryPath: string): Map<string, boolean> {
	const supportedLanguages: Map<string, boolean> = new Map();
	fs.readdirSync(i18nDirectoryPath).map(fileName => {
		return path.join(i18nDirectoryPath, fileName);
	}).filter(filePath => {
		return fs.statSync(filePath).isFile();
	}).map(filePath => {
		let language = path.basename(filePath, path.extname(filePath));
		const isDefaultLanguage = path.extname(language) === ".default";
		if (isDefaultLanguage) {
			language = path.basename(language, ".default");
		}
		supportedLanguages.set(language, isDefaultLanguage);
		delete (<any>require).cache[(<any>require).resolve(filePath)];
		const i18nContent = require(filePath);
		const i18nContentIterator = i18nContentGenerator(i18nContent);
		supportedPlatforms[platformName].createResourcesFiles(
			appResourcesDir, language, isDefaultLanguage, i18nContentIterator
		);
	});
	return supportedLanguages;
}

function * i18nContentGenerator(i18nContent: any) {
	const stack = [{ prefix: null, element: i18nContent }];
	while (stack.length > 0) {
		const { prefix, element } = stack.pop();
		if (Array.isArray(element)) {
			yield { key: prefix, value: element.join("") };
		} else if (typeof element === "object") {
			for (const key of Object.keys(element)) {
				stack.push({ prefix: prefix === null ? key : `${prefix}.${key}`, element: element[key] });
			}
		} else {
			yield { key: prefix, value: new String(element) };
		}
	}
}
