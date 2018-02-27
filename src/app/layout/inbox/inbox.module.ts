import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent} from './inbox.component';

@NgModule({
  imports: [
    CommonModule,
    InboxRoutingModule
  ],
  declarations: [InboxComponent]
})
export class InboxModule { }
