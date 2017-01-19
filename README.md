# nativescript-localize
[![npm](https://img.shields.io/npm/v/nativescript-localize.svg)](https://www.npmjs.com/package/nativescript-localize)
[![npm](https://img.shields.io/npm/dt/nativescript-localize.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-localize)

This is a plugin for NativeScript that implements internationalization (i18n) using the native platforms standards.
It is inspired from [nativescript-i18n](https://github.com/rborn/nativescript-i18n)

## Install
```shell
npm install --save nativescript-localize
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

### Angular 2
#### app.module.ts
```ts
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptLocalizeModule } from "nativescript-localize";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptLocalizeModule.forRoot() // import the module here using the forRoot static method
                                         // import it directly if in a lazy loaded module
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
```

#### Template
```xml
<Label text="{{ 'Hello world !' | L }}">
<Label text="{{ 'I am %s' | L:'user name' }}">
```

### Javascript
#### app.js
```js
const application = require("application");
const localize = require("nativescript-localize").localize;
application.resource.L = localize;
```

#### Template
```xml
<Label text="{{ L('Hello world !') }}">
<Label text="{{ L('I am %s', 'user name') }}">
```

## Localize the application name
The "app.name" key is used to localize the application name:
```json
{
  "app.name": "My app"
}
```

## Default language
Add the `.default` extension to the default language file to set it as the fallback language:
```
fr.default.json
```

## File format
Each file is imported using `require`, use the file format of your choice:

#### JSON
```json
{
  "app.name": "My app",
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
