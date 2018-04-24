interface ILogger {
  setLevel(level: string): void;
  getLevel(): string;
  fatal(formatStr?: any, ...args: any[]): void;
  error(formatStr?: any, ...args: any[]): void;
  warn(formatStr?: any, ...args: any[]): void;
  warnWithLabel(formatStr?: any, ...args: any[]): void;
  info(formatStr?: any, ...args: any[]): void;
  debug(formatStr?: any, ...args: any[]): void;
  trace(formatStr?: any, ...args: any[]): void;
  printMarkdown(...args: any[]): void;
  out(formatStr?: any, ...args: any[]): void;
  write(...args: any[]): void;
  prepare(item: any): string;
  printInfoMessageOnSameLine(message: string): void;
  printMsgWithTimeout(message: string, timeout: number): Promise<void>;
}

interface IPlatformData {
  frameworkPackageName: string;
  platformProjectService: IPlatformProjectService;
  projectRoot: string;
  normalizedPlatformName: string;
  appDestinationDirectoryPath: string;
  deviceBuildOutputPath: string;
  emulatorBuildOutputPath?: string;
  validPackageNamesForDevice: string[];
  validPackageNamesForEmulator?: string[];
  frameworkFilesExtensions: string[];
  frameworkDirectoriesExtensions?: string[];
  frameworkDirectoriesNames?: string[];
  targetedOS?: string[];
  configurationFileName?: string;
  configurationFilePath?: string;
  relativeToFrameworkConfigurationFilePath: string;
  fastLivesyncFileExtensions: string[];
}

interface IPlatformsData {
  availablePlatforms: any;
  platformsNames: string[];
  getPlatformData(platform: string, projectData: IProjectData): IPlatformData;
}

interface IPlatformProjectService {
  getAppResourcesDestinationDirectoryPath(projectData: IProjectData): string;
}

interface IProjectData {
  projectDir: string;
  projectName: string;
  platformsDir: string;
  projectFilePath: string;
  projectId?: string;
  dependencies: any;
  appDirectoryPath: string;
  appResourcesDirectoryPath: string;
  projectType: string;
	nsConfig: any;
  androidManifestPath: string;
	appGradlePath: string;
	gradleFilesDirectoryPath: string;
	infoPlistPath: string;
	buildXcconfigPath: string;
  getAppDirectoryPath(projectDir?: string): string;
	getAppDirectoryRelativePath(): string;
	getAppResourcesDirectoryPath(projectDir?: string): string;
  getAppResourcesRelativeDirectoryPath(): string;
}
