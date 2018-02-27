import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewChallengeComponent } from './view-challenge.component';

const routes: Routes = [
  { path: '', component: ViewChallengeComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewChallengeRoutingModule { }
