import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { LoginService } from "./login.service";
import { TranslateService } from "@ngx-translate/core";
import {CommonService} from "../shared/services/common-service";

@Component({
  selector: 'app-login',
  providers: [LoginService, CommonService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private apiUrl = '/api/mains';
  data: any = {};
  version = '3.0.0';
  loginForm: FormGroup;
  forceDisabled: boolean;

  constructor(
    public router: Router,
    private loginService: LoginService,
    private http: Http,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private cs: CommonService
  ) {
    // this.getMainData();
    this.forceDisabled = false;
    this.loginForm = new FormGroup({
      account: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    // --- testing data ---
    /*
    localStorage.setItem('isLoggedin', 'true');
    localStorage.setItem('uid', '5a11ba5d02e3390bccfd1e63');
    localStorage.setItem('jwttoken', 'testing-token');
    localStorage.setItem('account', 'leoycy');
    localStorage.setItem('fullName', 'Leo Yeung');
    localStorage.setItem('email', 'leoycy@gmail.com');
    localStorage.setItem('type', 'Learner');
    localStorage.setItem('language', 'en');
    */
  }

  onSubmit(a: any, values: any) {
    this.forceDisabled = true;
    try {
      this.loginService.register(values).then((result) => {
        if (result['success']) {
          // go login page
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('uid', result['id']);
          localStorage.setItem('jwttoken', result['token']);
          localStorage.setItem('account', result['account']);
          localStorage.setItem('fullName', result['fullName']);
          localStorage.setItem('email', result['email']);
          localStorage.setItem('type', result['type']);
          localStorage.setItem('language', result['language']);
          this.changeLang(result['language']);
          // router
          this.router.navigateByUrl('/main').then(nav => {
            // console.log(nav); // true if navigation is successful
          }, err => {
            console.log(err) // when there's an error
          });
        }
      }, (err) => {
        // show error why cannot register
        // console.log(err);
        try {
          const body = JSON.parse(err['_body']);
          const msg = body['msg'];
          this.openSnackBarForRetry(msg + ' Press "Try Again" or wait 10 seconds to unlock login button', 'Try Again');
        } catch (ex2) {
          this.openSnackBarForRetry(' Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock login button', 'Try Again');
        }
      });
    } catch (ex) {
      this.openSnackBarForRetry(' Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock login button', 'Try Again');
    }
  }

  ngOnInit() { }

  getMainData() {
    const query = this.http.get(this.apiUrl).map((res: Response) => res.json());
    query.subscribe(data => {
      // console.log(data);
      this.data = data;
      this.version = data.version;
    });
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

  changeLang(language: string) {
    this.translate.use(language);
  }

}
