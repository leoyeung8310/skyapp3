import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchievementsRoutingModule } from './achievements-routing.module';
import { AchievementsComponent } from './achievements.component';

@NgModule({
  imports: [
    CommonModule,
    AchievementsRoutingModule
  ],
  declarations: [AchievementsComponent]
})
export class AchievementsModule { }
