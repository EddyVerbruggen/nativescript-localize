import { localize } from "nativescript-localize";
import Vue from "nativescript-vue";

import App from "./components/App.vue";

Vue.config.silent = (TNS_ENV === "production");
Vue.filter("L", localize);

new Vue({
  render: h => h("frame", [h(App)])
}).$start();
