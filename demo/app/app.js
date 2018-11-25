var application = require("application");
var localize = require("nativescript-localize");

application.setResources({ L: localize });
application.start({ moduleName: "main-page" });
