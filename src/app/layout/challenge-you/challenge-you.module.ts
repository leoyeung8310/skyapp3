import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeYouRoutingModule } from './challenge-you-routing.module';
import { ChallengeYouComponent } from './challenge-you.component';
import { PageHeaderModule } from '../../shared/';
import { SkyboardModule } from '../../shared/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { ViewChallengeComponent } from './view-challenge/view-challenge.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PopoverModule } from 'ngx-popover';
import { MatInputModule, MatMenuModule, MatTabsModule, MatExpansionModule} from '@angular/material'; // must import after browser animation
import { ChartsModule } from 'ng2-charts';
import { SharedPipesModule} from '../../shared';
import { TimeAgoPipe} from 'time-ago-pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ChallengeYouRoutingModule,
    PageHeaderModule,
    SkyboardModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    PopoverModule,
    MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    ChartsModule,
    SharedPipesModule,
    TranslateModule
  ],
  declarations: [
    ChallengeYouComponent,
    CreateChallengeComponent,
    ViewChallengeComponent,
    TimeAgoPipe
  ]
})
export class ChallengeYouModule { }
