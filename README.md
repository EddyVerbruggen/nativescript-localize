# nativescript-localize
[![npm](https://img.shields.io/npm/v/nativescript-localize.svg)](https://www.npmjs.com/package/nativescript-localize)
[![npm](https://img.shields.io/npm/dm/nativescript-localize.svg)](https://www.npmjs.com/package/nativescript-localize)

This is a plugin for NativeScript that implements internationalization (i18n) using the native capabilities
of each platform. It is inspired from [nativescript-i18n](https://github.com/rborn/nativescript-i18n)

## Credits
A lot of thanks goes out to [Ludovic Fabrèges (@lfabreges)](https://github.com/lfabreges) for developing and maintaining this plugin in the past. When he had to abandon it due to shifted priorities, he was kind enough to [move the repo to me](https://github.com/EddyVerbruggen/nativescript-localize/issues/73).

## Table of contents
* [Installation](#installation)
* [Usage](#usage)
  * [Angular](#angular)
  * [Javascript](#javascript)
  * [Vue](#vue)
* [File format](#file-format)
* [Frequently asked questions](#frequently-asked-questions)
  * [How to set the default language?](#how-to-set-the-default-language)
  * [How to localize the application name?](#how-to-localize-the-application-name)
  * [How to localize iOS properties?](#how-to-localize-ios-properties)
  * [How to change the language dynamically at runtime?](#how-to-change-the-language-dynamically-at-runtime)
* [Troubleshooting](#troubleshooting)
  * [The angular localization pipe does not work when in a modal context](#the-angular-localization-pipe-does-not-work-when-in-a-modal-context)

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

You need to [set the default langage](#how-to-set-the-default-language) and make sure it contains
the [application name](#how-to-localize-the-application-name) to avoid any error.

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
<Label text="{{ 'Hello world !' | L }}"/>
<Label text="{{ 'I am %s' | L:'user name' }}"/>
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
<Label text="{{ L('Hello world !') }}"/>
<Label text="{{ L('I am %s', 'user name') }}"/>
```

#### Script
```js
const localize = require("nativescript-localize");

console.log(localize("Hello world !"));
```

### Vue
#### app.js
```js
import { localize } from "nativescript-localize";

Vue.filter("L", localize);
```

#### Template
```html
<Label :text="'Hello world !'|L"></Label>
<Label :text="'I am %s'|L('user name')"></Label>
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
  "sprintf": "format me %s",
  "sprintf with numbered placeholders": "format me %2$s one more time %1$s"
}
```

#### Javascript
```js
const i18n = {
  "app.name": "My app"
};

module.exports = i18n;
```

## Frequently asked questions
### How to set the default language?
Add the `.default` extension to the default language file to set it as the fallback language:
```
fr.default.json
```

### How to localize the application name?
The `app.name` key is used to localize the application name:
```json
{
  "app.name": "My app"
}
```

### How to localize iOS properties?
Keys starting with `ios.info.plist.` are used to localize iOS properties:
```json
{
  "ios.info.plist.NSLocationWhenInUseUsageDescription": "This will be added to InfoPlist.strings"
}
```

### How to change the language dynamically at runtime?
This plugin uses the native capabilities of each platform, language selection is therefore made by the OS.

On iOS you can programmatically override this language since plugin version 4.2.0 by doing this:

```typescript
import { overrideLocale } from "nativescript-localize/localize";
const localeOverriddenSuccessfully = overrideLocale("en-GB"); // or "nl-NL", etc
```

## Troubleshooting
### The angular localization pipe does not work when in a modal context
As a workaround, you can trigger a change detection from within your component constructor:
```ts
constructor(
  private readonly params: ModalDialogParams,
  private readonly changeDetectorRef: ChangeDetectorRef,
) {
  setTimeout(() => this.changeDetectorRef.detectChanges(), 0);
}
```
