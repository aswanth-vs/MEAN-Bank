import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const options = {
  headers: new HttpHeaders(),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  register(acno: any, username: any, password: any) {
    const body = {
      acno,
      username,
      password,
    };
    return this.http.post('http://localhost:3000/register', body);
  }

  login(acno: any, password: any) {
    const body = {
      acno,
      password,
    };
    return this.http.post('http://localhost:3000/login', body);
  }

  appendToken() {
    let token = localStorage.getItem('token');
    //create http header
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.append('verify-token', token);
      options.headers = headers;
    }
    return options;
  }

  getBalance(acno: any) {
    return this.http.get(
      'http://localhost:3000/get-balance/' + acno,
      this.appendToken()
    );
  }

  fundTransfer(toAcno: any, pswd: any, amount: any) {
    const body = {
      toAcno,
      pswd,
      amount,
    };
    console.log('Inside FT service');

    return this.http.post(
      'http://localhost:3000/fund-transfer',
      body,
      this.appendToken()
    );
  }

  getTransactions() {
    return this.http.get(
      'http://localhost:3000/transactions',
      this.appendToken()
    );
  }
}
