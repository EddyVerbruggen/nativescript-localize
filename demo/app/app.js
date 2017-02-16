var application = require("application");
var localize = require("nativescript-localize").localize;
application.resources.L = localize;
application.start({ moduleName: "main-page" });
