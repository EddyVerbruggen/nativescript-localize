export { localize } from "./sources/localize";

try {
  exports.NativeScriptLocalizeModule = require("./sources/localize.module").NativeScriptLocalizeModule;
} catch (error) {
  // Optional Peer Dependency @angular/core is not installed
}
