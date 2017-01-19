import { ModuleWithProviders, NgModule, Pipe } from "@angular/core";
import { LocalizePipe } from "./localize.pipe";

@NgModule({ declarations: [LocalizePipe], exports: [LocalizePipe] })
export class NativeScriptLocalizeModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: NativeScriptLocalizeModule };
  }
}
