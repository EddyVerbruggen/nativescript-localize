var application = require("tns-core-modules/application");
var localize = require("nativescript-localize");

application.setResources({ L: localize });
application.run({ moduleName: "main-page" });
