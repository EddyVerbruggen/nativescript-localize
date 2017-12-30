# nativescript-localize
[![Build Status](https://travis-ci.org/lfabreges/nativescript-localize.svg?branch=master)](https://travis-ci.org/lfabreges/nativescript-localize)
[![npm](https://img.shields.io/npm/v/nativescript-localize.svg)](https://www.npmjs.com/package/nativescript-localize)
[![npm](https://img.shields.io/npm/dt/nativescript-localize.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-localize)

This is a plugin for NativeScript that implements internationalization (i18n) using the native platforms standards.
It is inspired from [nativescript-i18n](https://github.com/rborn/nativescript-i18n)

## Installation
```shell
tns plugin add nativescript-localize
```

## Usage
Create a folder `i18n` in the `app` folder with the following structure:
```
app
  | i18n
      | en.json           <-- english language
      | fr.default.json   <-- french language (default)
      | es.js
```

### Angular
#### app.module.ts
```ts
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
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
```

#### Template
```xml
<Label text="{{ 'Hello world !' | L }}"></Label>
<Label text="{{ 'I am %s' | L:'user name' }}"></Label>
```

#### Script
```ts
import { localize } from "nativescript-localize";

console.log(localize("Hello world !"));
```

### Javascript
#### app.js
```js
const application = require("application");
const localize = require("nativescript-localize");
application.setResources({ L: localize });
```

#### Template
```xml
<Label text="{{ L('Hello world !') }}"></Label>
<Label text="{{ L('I am %s', 'user name') }}"></Label>
```

#### Script
```js
const localize = require("nativescript-localize");

console.log(localize("Hello world !"));
```

## Default language
Add the `.default` extension to the default language file to set it as the fallback language:
```
fr.default.json
```

## Localize the application name
The "app.name" key is used to localize the application name:
```json
{
  "app.name": "My app"
}
```

## Localize iOS properties
Keys starting with `ios.info.plist.` are used to localize iOS properties:
```json
{
  "ios.info.plist.NSLocationWhenInUseUsageDescription": "This will be added to InfoPlist.strings"
}
```

## File format
Each file is imported using `require`, use the file format of your choice:

#### JSON
```json
{
  "app.name": "My app",
  "ios.info.plist": {
    "NSLocationWhenInUseUsageDescription": "This will be added to InfoPlist.strings"
  },
  "user": {
    "name": "user.name",
    "email": "user.email"
  },
  "array": [
    "split the translation into ",
    "multiples lines"
  ],
  "sprintf": "format me %s"
}
```

#### Javascript
```js
const i18n = {
  "app.name": "My app"
};

module.exports = i18n;
```
