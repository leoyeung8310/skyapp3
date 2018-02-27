import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateChallengeComponent } from './create-challenge.component';

const routes: Routes = [
  { path: '', component: CreateChallengeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateChallengeRoutingModule { }
