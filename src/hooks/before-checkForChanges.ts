import { ConverterCommon } from "./converter.common";
import { ConverterAndroid } from "./converter.android";
import { ConverterIOS } from "./converter.ios";

export = function(
  androidResourcesMigrationService: IAndroidResourcesMigrationService,
  logger: ILogger,
  platformsData: IPlatformsData,
  projectData: IProjectData,
  hookArgs: any
) {
  const platformName = hookArgs.checkForChangesOpts.platform.toLowerCase();
  const platformData = platformsData.getPlatformData(platformName, projectData);

  let converter: ConverterCommon;

  if (platformName === "android") {
    converter = new ConverterAndroid(androidResourcesMigrationService, logger, platformData, projectData);
  } else if (platformName === "ios") {
    converter = new ConverterIOS(logger, platformData, projectData);
  } else {
    logger.warn(`Platform '${platformName}' isn't supported: skipping localization`);
    return;
  }

  converter.run();
};
