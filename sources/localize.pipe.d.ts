import { PipeTransform } from "@angular/core";

export declare class LocalizePipe implements PipeTransform {
  public transform(key: string, ...args: string[]): string;
}
