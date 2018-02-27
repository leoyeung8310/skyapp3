import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {
  // <div [innerHTML]="your.value | sanitizeHtml" ></div>
  constructor(private _sanitizer:DomSanitizer) {
  }
  transform(value: any, args?: any):SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}


