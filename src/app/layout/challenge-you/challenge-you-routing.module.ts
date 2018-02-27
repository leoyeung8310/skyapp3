import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengeYouComponent } from './challenge-you.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { ViewChallengeComponent } from './view-challenge/view-challenge.component';

const routes: Routes = [
  {path: '', component: ChallengeYouComponent, pathMatch: 'full'},
  {path: 'create', component: CreateChallengeComponent},
  {path: 'view', component: ViewChallengeComponent},
  {path: 'view/:id', component: ViewChallengeComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeYouRoutingModule { }
