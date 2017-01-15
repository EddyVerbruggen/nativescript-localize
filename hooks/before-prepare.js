const resourceForAndroid = require("../sources/resource.android");
const resourceForIOs = require("../sources/resource.ios");
const fs = require("fs-extra");
const path = require("path");

function createResourceForAndroid(logger, appResourcesDirectoryPath, language, isDefaultLanguage, iterator) {
	const resourceFilePath = path.join(
		appResourcesDirectoryPath,
		"Android",
		"values" + (isDefaultLanguage ? "" : "-" + language),
		"strings.xml"
	);
	fs.ensureFileSync(resourceFilePath);
	const stream = fs.createWriteStream(resourceFilePath);
	stream.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
	stream.write("<resources>");
	for (const { key, value } of iterator) {
		const encodedKey = resourceForAndroid.encodeKey(key);
		const encodedValue = resourceForAndroid.encodeValue(value);
		if (key === "app.name") {
			stream.write(`<string name="app_name">${encodedValue}</string>`);
			stream.write(`<string name="title_activity_kimera">${encodedValue}</string>`);
		}
	  stream.write(`<string name="${encodedKey}">${encodedValue}</string>`);
	}
	stream.write("</resources>");
	stream.end();
}

function createResourceForIos(logger, appResourcesDirectoryPath, language, isDefaultLanguage, iterator) {
	const resourceFilePath = path.join(appResourcesDirectoryPath, "iOS", language + ".lproj", "Localizable.strings");
	fs.ensureFileSync(resourceFilePath);
	const stream = fs.createWriteStream(resourceFilePath);
	for (const { key, value } of iterator) {
		const encodedKey = resourceForIOs.encodeKey(key);
		const encodedValue = resourceForIOs.encodeValue(value);
		stream.write(`"${encodedKey}" = "${encodedValue}";\n`);
		if (key === "app.name") {
			const infoPlistStringsFilePath = path.join(appResourcesDirectoryPath, "iOS", language + ".lproj", "InfoPlist.strings");
			fs.ensureFileSync(infoPlistStringsFilePath);
			try {
				const infoPlistStringsContent = fs.readFileSync(infoPlistStringsFilePath, "utf8");
				const pattern = /^(\s*?"?CFBundleDisplayName"?\s*?=\s*?)"?.*?"?\s*?;\s*?$/gm
				if (infoPlistStringsContent.match(pattern)) {
					fs.writeFileSync(infoPlistStringsFilePath, infoPlistContent.replace(pattern, "$1" + `"${encodedValue}";`));
				} else {
					fs.appendFileSync(infoPlistStringsFilePath, `\n"CFBundleDisplayName" = "${encodedValue}";\n`)
				}
			} catch (error) {
			}
		}
	}
	stream.end();
	if (isDefaultLanguage) {
		const infoPlistFilePath = path.join(appResourcesDirectoryPath, "iOS", "Info.plist");
		try {
			const infoPlistContent = fs.readFileSync(infoPlistFilePath, "utf8");
			fs.writeFileSync(infoPlistFilePath, infoPlistContent.replace(
				/(<key>CFBundleDevelopmentRegion<\/key>\s*<string>).*?(<\/string>)/, "$1" + language + "$2")
			);
		} catch (error) {
		}
	}
}

function * traverseThroughStrings(logger, strings) {
	const stack = [{ prefix: null, element: strings }];
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

const createResourceForPlatforms = {
	"android": createResourceForAndroid,
	"ios": createResourceForIos
};

module.exports = function(logger, platformsData, projectData, hookArgs) {
	const platformName = hookArgs.platform.toLowerCase();
	const appResourcesDirectoryPath = projectData.appResourcesDirectoryPath;
	const i18nDirectoryPath = path.join(projectData.projectDir, "app", "i18n");
	if (!fs.existsSync(i18nDirectoryPath) || !createResourceForPlatforms.hasOwnProperty(platformName)) {
		return;
	}
	fs.readdirSync(i18nDirectoryPath).map(fileName => {
		return path.join(i18nDirectoryPath, fileName);
	}).filter(filePath => {
		return fs.statSync(filePath).isFile();
	}).forEach(filePath => {
		const strings = require(filePath);
		const iterator = traverseThroughStrings(logger, strings);
		let language = path.basename(filePath, path.extname(filePath));
		const isDefaultLanguage = path.extname(language) === ".default";
		if (isDefaultLanguage) { language = path.basename(language, ".default"); }
		createResourceForPlatforms[platformName](logger, appResourcesDirectoryPath, language, isDefaultLanguage, iterator);
	});
};
