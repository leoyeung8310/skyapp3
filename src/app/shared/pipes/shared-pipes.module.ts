import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { FiveStarsPipe } from './five-stars.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [SanitizeHtmlPipe, FiveStarsPipe],
    exports: [SanitizeHtmlPipe, FiveStarsPipe]
})
export class SharedPipesModule {}
