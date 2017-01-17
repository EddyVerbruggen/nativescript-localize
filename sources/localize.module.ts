import { ModuleWithProviders, NgModule, Optional, Pipe, PipeTransform, SkipSelf } from "@angular/core";
import { LocalizePipe } from "./localize.pipe";

@NgModule({ declarations: [LocalizePipe], exports: [LocalizePipe] })
export class NativeScriptLocalizeModule {
  public constructor(@Optional() @SkipSelf() parentModule: NativeScriptLocalizeModule) {
    if (parentModule) {
      throw new Error("NativeScriptLocalizeModule is already loaded, import it in the AppModule only");
    }
  }
}
