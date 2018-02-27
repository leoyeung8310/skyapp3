import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../../shared/';
import { SkyboardModule } from '../../../shared/';
import { SkyboardComponent } from '../../../shared/modules/skyboard/skyboard.component';

import { ViewChallengeRoutingModule } from './view-challenge-routing.module';
import { ViewChallengeComponent } from './view-challenge.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileSaverModule } from 'ngx-filesaver';
import { MatTabsModule, MatExpansionModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { TimeAgoPipe} from 'time-ago-pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ViewChallengeRoutingModule,
    PageHeaderModule,
    SkyboardModule,
    SkyboardComponent,
    ColorPickerModule,
    FileSaverModule,
    MatTabsModule,
    MatExpansionModule,
    ChartsModule,
    TranslateModule
  ],
  declarations: [
    ViewChallengeComponent,
    TimeAgoPipe
  ]
})
export class ViewChallengeModule { }

