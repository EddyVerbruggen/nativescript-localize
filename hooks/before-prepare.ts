import * as fs from "fs";
import * as path from "path";

import { ConverterCommon } from "./converter.common";
import { ConverterAndroid } from "./converter.android";
import { ConverterIOS } from "./converter.ios";

export = function(
  logger: ILogger,
  platformsData: IPlatformsData,
  projectData: IProjectData,
  liveSyncService: any,
  hookArgs: any
) {
  const platformName = hookArgs.platform.toLowerCase();
  const platformData = platformsData.getPlatformData(platformName, projectData);

  let converter: ConverterCommon;

  if (platformName === "android") {
    converter = new ConverterAndroid(logger, platformData, projectData);
  } else if (platformName === "ios") {
    converter = new ConverterIOS(logger, platformData, projectData);
  } else {
    logger.warn(`Platform '${platformName}' isn't supported: skipping localization`);
    return;
  }

  // HACK : https://github.com/NativeScript/nativescript-cli/issues/3251
  if (liveSyncService &&
      liveSyncService.liveSyncProcessesInfo[projectData.projectDir] &&
      liveSyncService.liveSyncProcessesInfo[projectData.projectDir].watcherInfo &&
      liveSyncService.liveSyncProcessesInfo[projectData.projectDir].watcherInfo.watcher
  ) {
    const watcherInfo = liveSyncService.liveSyncProcessesInfo[projectData.projectDir].watcherInfo;
    if (!watcherInfo._isLocalizePluginHackInstalledForPlatform) {
      watcherInfo._isLocalizePluginHackInstalledForPlatform = {};
    }
    if (!watcherInfo._isLocalizePluginHackInstalledForPlatform[platformName]) {
      converter.livesyncExclusionPatterns().forEach(pattern => {
        watcherInfo.watcher.unwatch(path.relative(projectData.projectDir, pattern));
      });
      watcherInfo._isLocalizePluginHackInstalledForPlatform[platformName] = true;
    }
  }

  converter
    .on(ConverterCommon.RESOURCE_CHANGED_EVENT, () => hookArgs.changesInfo.appResourcesChanged = true)
    .on(ConverterCommon.CONFIGURATION_CHANGED_EVENT, () => hookArgs.changesInfo.configChanged = true)
    .run()
  ;
};
