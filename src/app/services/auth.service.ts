import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  user = new BehaviorSubject(null);

  private baseApi = 'https://c.jordanwebmaster.com/flexihire/public/api';
  private auth_token;
  // constructor() {
  //   if (sessionStorage.getItem('user')) {
  //     this.user.next(JSON.parse(sessionStorage.getItem('user')));
  //   }
  // }
  onRegister(data) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.baseApi + '/register', data, { headers });
  }

  onLogin(data) {
    return this.http.post(this.baseApi + '/login', data);
  }

  onLogout() {
    this.auth_token = JSON.parse(sessionStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    return this.http.post(this.baseApi + '/logout', null, { headers });
  }

  onForgetPassword(data) {
    console.log(data);
    return this.http.post(this.baseApi + '/forgot-password', data);
  }
  onResetPassword(data) {
    console.log(data);
    return this.http.post(this.baseApi + '/reset-password', data);
  }
  
}
