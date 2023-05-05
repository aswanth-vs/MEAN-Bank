import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dashboardRouter: Router
  ) {}
  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      alert('Please Login');
      this.dashboardRouter.navigateByUrl('');
    }
    if (localStorage.getItem('currentUser')) {
      this.user = localStorage.getItem('currentUser') || '';
    }
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = localStorage.getItem('currentAcno');
    }
  }
  user: string = '';
  currentAcno: any;
  balance: Number = 0;
  isCollapse: boolean = true;
  transferSuccessMsg: String = '';
  transferErrorMsg: String = '';
  acno: any = '';
  deleteConfirmStatus: boolean = false;

  //ReadMore collapse
  collapse() {
    this.isCollapse = !this.isCollapse;
  }

  //fund transfer
  fundTransferForm = this.fb.group({
    creditAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  //get balance
  getBalance() {
    console.log('Inside getbalance');
    this.api.getBalance(this.currentAcno).subscribe(
      (result: any) => {
        this.balance = result.balance;
        console.log(this.balance);
      },
      (result: any) => {
        alert(result.error.message);
      }
    );
  }

  transfer() {
    if (this.fundTransferForm.valid) {
      let creditAcno = this.fundTransferForm.value.creditAcno;
      let pswd = this.fundTransferForm.value.password;
      let amount = this.fundTransferForm.value.amount;
      this.api.fundTransfer(creditAcno, pswd, amount).subscribe(
        (result: any) => {
          console.log(result);
          this.transferSuccessMsg = result.message;
          this.transferErrorMsg = '';
        },
        (result: any) => {
          console.log(result.error);
          this.transferErrorMsg = result.error.message;
          this.transferSuccessMsg = '';
        }
      );
    } else {
      alert('Invalid Form');
    }
  }

  //to clear the fund transfer form
  clearFundTransfer() {
    this.fundTransferForm.reset();
    this.transferErrorMsg = '';
    this.transferSuccessMsg = '';
  }

  logout() {
    //remove all data stored in local storage for this particular user
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('currentAcno');
    //navigate to login
    this.dashboardRouter.navigateByUrl('');
    console.log('lol');
  }

  deleteAcno() {
    this.acno = localStorage.getItem('currentAcno');
    this.deleteConfirmStatus = true;
  }
}
