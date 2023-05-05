import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  //Adds bg color to the component
  ngOnInit() {
    document.body.style.background = 'rgb(59,173,252)';
  }

  //Makes it so that the bg color is only loaded for this component only.
  ngOnDestroy(): void {
    document.body.style.background = 'white';
  }

  registerErrorMsg: string = '';
  registerSuccessMsg: string = '';

  //Form group
  registerForm = this.registerFb.group({
    //form array
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    accno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  constructor(
    private registerFb: FormBuilder,
    private api: ApiService,
    private registerRouter: Router
  ) {}

  register() {
    if (this.registerForm.valid) {
      let username = this.registerForm.value.username;
      let acno = this.registerForm.value.accno;
      let password = this.registerForm.value.password;
      this.api.register(acno, username, password).subscribe(
        (result: any) => {
          // alert(result.message);
          this.registerSuccessMsg = result.message;
          setTimeout(() => {
            this.registerRouter.navigateByUrl('');
          }, 3000);
        },
        (result: any) => {
          this.registerErrorMsg = result.error.message;
          setTimeout(() => {
            this.registerForm.reset();
            this.registerErrorMsg = '';
          }, 4000);
        }
      );
    } else {
      alert('Invalid');
    }
  }
}
