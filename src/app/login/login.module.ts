import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ChatComponent } from './chat/chat.component';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule
  ],
  declarations: [LoginComponent, ChatComponent]
})
export class LoginModule { }
