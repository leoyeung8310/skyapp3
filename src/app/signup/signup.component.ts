import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from './signup.service';
import { MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-signup',
    providers: [SignupService],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registrationForm: FormGroup;
  forceDisabled: boolean;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private signupService: SignupService,
    public snackBar: MatSnackBar
  ) {
    this.forceDisabled = false;
    // form
    this.registrationForm = new FormGroup({
      code: new FormControl('', Validators.required),
      account: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose( [ Validators.email, Validators.required ] ) )
    });
  }

  ngOnInit() {

  }

  onSubmit(a: any, values: any) {
    this.forceDisabled = true;
    try {
      this.signupService.register(values).then((result) => {
        if (result['success']) {
          // go login page
          this.openSnackBarForLogin(result['msg'] + ', Press "OK" or wait 5 seconds to redirect to login page', 'OK');
        }
      }, (err) => {
        // show error why cannot register
        // console.log(err);
        try {
          const body = JSON.parse(err['_body']);
          const msg = body['msg'];
          this.openSnackBarForRetry(msg + ', Press "Try Again" or wait 10 seconds to unlock register button', 'Try Again');
        } catch (ex2) {
          this.openSnackBarForRetry('Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock register button', 'Try Again');
        }
      });
    } catch (ex) {
      this.openSnackBarForRetry('Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock register button', 'Try Again');
    }
  }

  openSnackBarForLogin(message: string, action: string) {
    const dConfig = new MatSnackBarConfig();
    dConfig.duration = 5000;
    const snackBarRef = this.snackBar.open(message, action, dConfig);
    snackBarRef.afterDismissed().subscribe(null, null, () => {
      // route to login page
      this.router.navigateByUrl('/login').then(nav => {
        console.log(nav); // true if navigation is successful
      }, err => {
        console.log(err) // when there's an error
      });
    })
    snackBarRef.onAction().subscribe(null, null, () => {
      this.snackBar.dismiss();
    })
  }

  openSnackBarForRetry(message: string, action: string) {
    const dConfig = new MatSnackBarConfig();
    dConfig.duration = 10000;
    const snackBarRef = this.snackBar.open(message, action, dConfig);
    snackBarRef.afterDismissed().subscribe(null, null, () => {
      // unlock submit button
      this.forceDisabled = false;
    })
    snackBarRef.onAction().subscribe(null, null, () => {
      this.snackBar.dismiss();
    })
  }
}
