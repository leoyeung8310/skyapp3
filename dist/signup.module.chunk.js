webpackJsonp(["signup.module"],{

/***/ "../../../../../src/app/signup/signup-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__signup_component__ = __webpack_require__("../../../../../src/app/signup/signup.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_2__signup_component__["a" /* SignupComponent */] }
];
var SignupRoutingModule = /** @class */ (function () {
    function SignupRoutingModule() {
    }
    SignupRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */]]
        })
    ], SignupRoutingModule);
    return SignupRoutingModule;
}());

//# sourceMappingURL=signup-routing.module.js.map

/***/ }),

/***/ "../../../../../src/app/signup/signup.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"login-page\">\n  <div class=\"row\">\n    <div class=\"col-md-4 push-md-4\">\n      <img class=\"user-avatar\" src=\"assets/images/logo.png\" width=\"150px\" />\n      <h1>SkyApp</h1>\n      <form [formGroup]=\"registrationForm\" id=\"registrationForm\" (ngSubmit)=\"onSubmit($event, registrationForm.value)\" novalidate>\n        <br>\n        <mat-form-field>\n          <input matInput formControlName=\"code\" id=\"code\" placeholder=\"Admin's Passcode\" required>\n          <mat-error>Admin's passcode is required</mat-error>\n        </mat-form-field>\n        <br>\n        <mat-form-field>\n          <input matInput formControlName=\"account\" id=\"account\" placeholder=\"Account\" required>\n          <mat-error>Account is required</mat-error>\n        </mat-form-field>\n        <br>\n        <mat-form-field>\n          <input matInput formControlName=\"password\" id=\"password\" placeholder=\"Password\" type=\"password\" required>\n          <mat-error>Password is required</mat-error>\n        </mat-form-field>\n        <br>\n        <mat-form-field>\n          <input matInput formControlName=\"confirmPassword\" id=\"confirmPassword\" placeholder=\"Repeat Password\" type=\"password\" required>\n          <mat-error>Confirm password is required</mat-error>\n        </mat-form-field>\n        <br>\n        <mat-form-field>\n          <input matInput formControlName=\"fullName\" id=\"fullName\" placeholder=\"Full Name\" required>\n          <mat-error>Full name is required</mat-error>\n        </mat-form-field>\n        <br>\n        <mat-form-field>\n          <input matInput formControlName=\"email\" ype=\"email\" id=\"email\" placeholder=\"Enter your email\" required>\n          <mat-error *ngIf=\"registrationForm.get('email').hasError('required')\">Email is required</mat-error>\n          <mat-error *ngIf=\"registrationForm.get('email').hasError('email')\">Not a valid email</mat-error>\n        </mat-form-field>\n        <br>\n        <br>\n        <br>\n        <button mat-raised-button type=\"submit\" color=\"primary\" [disabled]=\"( !registrationForm.valid || !registrationForm.dirty || forceDisabled)\">Register</button>\n        <a mat-raised-button routerLink=\"/login\">Back</a>\n      </form>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/signup/signup.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":host {\n  display: block; }\n\n.login-page {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: auto;\n  background: #f1f6ff;\n  text-align: center;\n  color: #022657;\n  padding: 3em; }\n  .login-page .col-lg-4 {\n    padding: 0; }\n  .login-page .input-lg {\n    height: 46px;\n    padding: 10px 16px;\n    font-size: 18px;\n    line-height: 1.3333333;\n    border-radius: 0; }\n  .login-page .input-underline {\n    background: 0 0;\n    border: none;\n    box-shadow: none;\n    border-bottom: 2px solid rgba(255, 255, 255, 0.5);\n    color: #FFF;\n    border-radius: 0; }\n  .login-page .input-underline:focus {\n    border-bottom: 2px solid #fff;\n    box-shadow: none; }\n  .login-page .rounded-btn {\n    border-radius: 50px;\n    color: rgba(255, 255, 255, 0.8);\n    background: #f1f6ff;\n    border: 2px solid rgba(255, 255, 255, 0.8);\n    font-size: 18px;\n    line-height: 40px;\n    padding: 0 25px; }\n  .login-page .rounded-btn:hover, .login-page .rounded-btn:focus, .login-page .rounded-btn:active, .login-page .rounded-btn:visited {\n    color: white;\n    border: 2px solid white;\n    outline: none; }\n  .login-page h1 {\n    font-weight: 300;\n    margin-top: 20px;\n    margin-bottom: 10px;\n    font-size: 36px; }\n    .login-page h1 small {\n      color: rgba(255, 255, 255, 0.7); }\n  .login-page .form-group {\n    padding: 8px 0; }\n    .login-page .form-group input::-webkit-input-placeholder {\n      color: rgba(255, 255, 255, 0.6) !important; }\n    .login-page .form-group input:-moz-placeholder {\n      /* Firefox 18- */\n      color: rgba(255, 255, 255, 0.6) !important; }\n    .login-page .form-group input::-moz-placeholder {\n      /* Firefox 19+ */\n      color: rgba(255, 255, 255, 0.6) !important; }\n    .login-page .form-group input:-ms-input-placeholder {\n      color: rgba(255, 255, 255, 0.6) !important; }\n  .login-page .form-content {\n    padding: 40px 0; }\n  .login-page .user-avatar {\n    border-radius: 50%;\n    border: 2px solid #FFF; }\n  .login-page a {\n    color: #0275d8;\n    text-decoration: none; }\n    .login-page a:focus, .login-page a:hover {\n      color: #014c8c;\n      text-decoration: none; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/signup/signup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__signup_service__ = __webpack_require__("../../../../../src/app/signup/signup.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__("../../../../@ngx-translate/core/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupComponent = /** @class */ (function () {
    function SignupComponent(translate, router, signupService, snackBar) {
        this.translate = translate;
        this.router = router;
        this.signupService = signupService;
        this.snackBar = snackBar;
        this.forceDisabled = false;
        // form
        this.registrationForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormGroup */]({
            code: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].required),
            account: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].required),
            password: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].required),
            confirmPassword: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].required),
            fullName: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].required),
            email: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].email, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["k" /* Validators */].required]))
        });
    }
    SignupComponent.prototype.ngOnInit = function () {
    };
    SignupComponent.prototype.onSubmit = function (a, values) {
        var _this = this;
        this.forceDisabled = true;
        try {
            this.signupService.register(values).then(function (result) {
                if (result['success']) {
                    // go login page
                    _this.openSnackBarForLogin(result['msg'] + ', Press "OK" or wait 5 seconds to redirect to login page', 'OK');
                }
            }, function (err) {
                // show error why cannot register
                // console.log(err);
                try {
                    var body = JSON.parse(err['_body']);
                    var msg = body['msg'];
                    _this.openSnackBarForRetry(msg + ', Press "Try Again" or wait 10 seconds to unlock register button', 'Try Again');
                }
                catch (ex2) {
                    _this.openSnackBarForRetry('Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock register button', 'Try Again');
                }
            });
        }
        catch (ex) {
            this.openSnackBarForRetry('Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock register button', 'Try Again');
        }
    };
    SignupComponent.prototype.openSnackBarForLogin = function (message, action) {
        var _this = this;
        var dConfig = new __WEBPACK_IMPORTED_MODULE_4__angular_material__["m" /* MatSnackBarConfig */]();
        dConfig.duration = 5000;
        var snackBarRef = this.snackBar.open(message, action, dConfig);
        snackBarRef.afterDismissed().subscribe(null, null, function () {
            // route to login page
            _this.router.navigateByUrl('/login').then(function (nav) {
                console.log(nav); // true if navigation is successful
            }, function (err) {
                console.log(err); // when there's an error
            });
        });
        snackBarRef.onAction().subscribe(null, null, function () {
            _this.snackBar.dismiss();
        });
    };
    SignupComponent.prototype.openSnackBarForRetry = function (message, action) {
        var _this = this;
        var dConfig = new __WEBPACK_IMPORTED_MODULE_4__angular_material__["m" /* MatSnackBarConfig */]();
        dConfig.duration = 10000;
        var snackBarRef = this.snackBar.open(message, action, dConfig);
        snackBarRef.afterDismissed().subscribe(null, null, function () {
            // unlock submit button
            _this.forceDisabled = false;
        });
        snackBarRef.onAction().subscribe(null, null, function () {
            _this.snackBar.dismiss();
        });
    };
    SignupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-signup',
            providers: [__WEBPACK_IMPORTED_MODULE_3__signup_service__["a" /* SignupService */]],
            template: __webpack_require__("../../../../../src/app/signup/signup.component.html"),
            styles: [__webpack_require__("../../../../../src/app/signup/signup.component.scss")]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__signup_service__["a" /* SignupService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__signup_service__["a" /* SignupService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_material__["l" /* MatSnackBar */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_material__["l" /* MatSnackBar */]) === "function" && _d || Object])
    ], SignupComponent);
    return SignupComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=signup.component.js.map

/***/ }),

/***/ "../../../../../src/app/signup/signup.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupModule", function() { return SignupModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__signup_routing_module__ = __webpack_require__("../../../../../src/app/signup/signup-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__signup_component__ = __webpack_require__("../../../../../src/app/signup/signup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__("../../../../@ngx-translate/core/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var SignupModule = /** @class */ (function () {
    function SignupModule() {
    }
    SignupModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3__signup_routing_module__["a" /* SignupRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["j" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["h" /* MatFormFieldModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["i" /* MatInputModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["k" /* MatSelectModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["n" /* MatSnackBarModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["b" /* MatButtonModule */],
                __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["b" /* TranslateModule */]
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__signup_component__["a" /* SignupComponent */]]
        })
    ], SignupModule);
    return SignupModule;
}());

//# sourceMappingURL=signup.module.js.map

/***/ }),

/***/ "../../../../../src/app/signup/signup.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SignupService = /** @class */ (function () {
    function SignupService(http) {
        this.http = http;
    }
    /*
    getChatByRoom(room) {
      return new Promise((resolve, reject) => {
        this.http.get('/chat/' + room)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }
    */
    SignupService.prototype.register = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post('/api/signup', data)
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    };
    SignupService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
    ], SignupService);
    return SignupService;
    var _a;
}());

//# sourceMappingURL=signup.service.js.map

/***/ })

});
//# sourceMappingURL=signup.module.chunk.js.map