import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SkyboardComponent } from './skyboard.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileSaverModule } from 'ngx-filesaver';
import { MatInputModule, MatCheckboxModule, MatDialogModule } from '@angular/material';
import { SkyboardDialogComponent } from './skyboard-dialog/skyboard-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ColorPickerModule,
    FileSaverModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    TranslateModule
  ],
  declarations: [
    SkyboardComponent,
    SkyboardDialogComponent
  ],
  entryComponents: [
    SkyboardDialogComponent
  ],
  exports: [SkyboardComponent]
})
export class SkyboardModule { }

