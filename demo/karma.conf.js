module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
      "app/**/*.js",
    ],
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    customLaunchers: {
      android: {
        base: "NS",
        platform: "android"
      },
      ios: {
        base: "NS",
        platform: "ios"
      },
      ios_simulator: {
        base: "NS",
        platform: "ios",
        arguments: ["--emulator"]
      }
    },
    singleRun: true
  });
}
