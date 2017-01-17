import * as fs from "fs";
import * as path from "path";

const createResourceForPlatforms = {
	"android": require("./before-prepare.android").createResourceFile,
	"ios": require("./before-prepare.ios").createResourceFile
};

export = function(logger, platformsData, projectData, hookArgs) {
	const platformName = hookArgs.platform.toLowerCase();
	const appResourcesDir = projectData.appResourcesDirectoryPath;
	const i18nDirectoryPath = path.join(projectData.projectDir, "app", "i18n");
	if (fs.existsSync(i18nDirectoryPath) && createResourceForPlatforms.hasOwnProperty(platformName)) {
		fs.readdirSync(i18nDirectoryPath).map(fileName => {
			return path.join(i18nDirectoryPath, fileName);
		}).filter(filePath => {
			return fs.statSync(filePath).isFile();
		}).forEach(filePath => {
			const i18nContent = require(filePath);
			const i18nContentIterator = i18nContentGeneratorIterator(i18nContent);
			let language = path.basename(filePath, path.extname(filePath));
			const isDefaultLanguage = path.extname(language) === ".default";
			if (isDefaultLanguage) { language = path.basename(language, ".default"); }
			createResourceForPlatforms[platformName](appResourcesDir, language, isDefaultLanguage, i18nContentIterator);
		});
	}
};

function * i18nContentGeneratorIterator(i18nContent) {
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
