import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TimelineComponent, TabsComponent } from './components';
import { StatModule, PageHeaderModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    NgbModule.forRoot(),
    StatModule,
    PageHeaderModule,
    TranslateModule
  ],
  declarations: [
    MainComponent,
    TimelineComponent,
    TabsComponent
  ]
})
export class MainModule { }
