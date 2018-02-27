import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared/';
import { SkyboardModule } from '../../../shared/';
import { SkyboardComponent } from '../../../shared/modules/skyboard/skyboard.component';
import { CreateChallengeRoutingModule } from './create-challenge-routing.module';
import { CreateChallengeComponent } from './create-challenge.component';
import { MatDialogModule } from '@angular/material'; // must import after browser animation
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateChallengeRoutingModule,
    PageHeaderModule,
    SkyboardModule,
    SkyboardComponent,
    MatDialogModule,
    TranslateModule
  ],
  declarations: [
    CreateChallengeComponent
  ]
})

export class CreateChallengeModule {}

