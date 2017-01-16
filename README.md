# nativescript-localize
This is a plugin for NativeScript that implements internationalization (i18n) using the native platforms standards.
It is inspired from [nativescript-i18n](https://github.com/rborn/nativescript-i18n)

## Install
~~~
npm install --save nativescript-localize
~~~

## Usage
Create a folder `i18n` in the `app` folder with the following structure:
~~~
app
  | i18n
      | en.json
      | fr.default.json
      | es.js
~~~

### Localize the application name
Add the "app.name" key for each language:
~~~
{
  "app.name": "My app"
}
~~~
or
~~~
{
  "app": {
    "name": "My app"
  }
}
~~~

### Default language
Add the `.default` extension to the default language file:
~~~
fr.default.json
~~~

### File format
#### JSON ####
~~~
{
  "app.name": "My app",
  "user": {
    "name": "user.name",
    "email": "user.email"
  },
  "array": [
    "split the translation into ",
    "multiples lines"
  ]
}
~~~

#### Javascript ####
~~~
const i18n = {
  "app.name": "My app"
};

module.exports = i18n;
~~~

### Javascript
#### app.js ####
~~~
const application = require("application");
const localize = require("nativescript-localize").localize;
application.resource.L = localize;
~~~

#### Template ####
~~~
<Label text="{{ L('Hello world !') }}">
<Label text="{{ L('I am %s', 'user name') }}">
~~~

### Angular
#### app.module.ts ####
~~~
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptLocalizeModule } from "nativescript-localize";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
~~~

#### Template ####
~~~
<Label text="{{ 'Hello world !' | L }}">
<Label text="{{ 'I am %s' | L:'user name' }}">
~~~
