import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent} from './records.component';

@NgModule({
  imports: [
    CommonModule,
    RecordsRoutingModule
  ],
  declarations: [RecordsComponent]
})
export class RecordsModule { }
