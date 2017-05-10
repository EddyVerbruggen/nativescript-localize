if (global.TNS_WEBPACK) {
  require("bundle-entry-points");
  global.registerModule("main-page", function () { return require("./main-page"); });
}
