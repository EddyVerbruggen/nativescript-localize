require("./bundle-config");
var application = require("application");
var localize = require("nativescript-localize").localize;
application.setResources({ L: localize });
application.start({ moduleName: "main-page" });
