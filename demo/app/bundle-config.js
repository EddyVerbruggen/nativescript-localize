if (global.TNS_WEBPACK) {
  require("bundle-entry-points");
  const context = require.context("~/", true, /(page|fragment)\.(xml|css|js|ts|scss|less|sass)$/);
  global.registerWebpackModules(context);
}
