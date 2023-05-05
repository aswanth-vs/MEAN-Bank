import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  //Adds bg color to the component
  ngOnInit() {
    document.body.style.background = '#0043A0';
    document.body.style.background = 'rgb(59,173,252)';
  }

  //Makes it so that the bg color is only loaded for this component only.
  ngOnDestroy(): void {
    document.body.style.background = 'white';
  }

  loginErrorMsg: string = '';
  loginSuccessStatus: boolean = false;

  constructor(
    private loginFb: FormBuilder,
    private api: ApiService,
    private loginRouter: Router
  ) {}

  loginForm = this.loginFb.group({
    //form array

    accno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  login() {
    if (this.loginForm.valid) {
      let acno = this.loginForm.value.accno;
      let password = this.loginForm.value.password;
      //api call for login
      this.api.login(acno, password).subscribe(
        // response 200
        (result: any) => {
          this.loginSuccessStatus = true;
          // saving username in local storage
          localStorage.setItem('currentUser', result.currentUser);
          //store token in local storage
          localStorage.setItem('token', result.token);
          //store current account number in local storage
          localStorage.setItem('currentAcno', result.currentAcno);
          //redirects to dashboard
          setTimeout(() => {
            this.loginRouter.navigateByUrl('dashboard');
          }, 3000);
        },
        //response 400
        (result: any) => {
          this.loginErrorMsg = result.error.message;
          setTimeout(() => {
            this.loginForm.reset();
            this.loginErrorMsg = '';
          }, 3000);
        }
      );
    } else {
      alert('Invalid');
    }
  }
}
