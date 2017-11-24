import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';

import { CookieService } from './cookie.service';

import 'rxjs/add/operator/toPromise';

let loggedIn = false;
let token: number = null;


@Injectable()
export class AuthService {
  
  subscriptions: any[] = [];
  
  constructor(
    private http: Http
  ) {
  }
  
  static hash(string) {
    return Md5.hashStr(string);
  }
  
  static loggedIn() {
    return loggedIn;
  }
  
  static token() {
    return token;
  }
  
  checkCookies() {
    return new Promise((resolve, reject) => {
      const cookieToken = parseInt(CookieService.get('token'), 10);
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ 'headers': headers });
      if (cookieToken) {
        this.http.post('/api/verify_token', {
          token: cookieToken
        }, options).toPromise().then(response => {
          if (response.json().success) {
            loggedIn = true;
            token = cookieToken;
            CookieService.set('token', cookieToken, {
              'max-age': '43200'
            });
            this.resolveSubs();
          }
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }
  
  auth(pw) {
    const password = AuthService.hash(pw);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    return this.http.post('/api/auth', {
      password: password
    }, options).toPromise().then(response => {
      const res = response.json();
      loggedIn = res.success;
      token = res.token;
      if (loggedIn) {
        CookieService.set('token', token, {
          'max-age': '43200'
        });
        this.resolveSubs();
      }
      return response.json();
    });
  }
  
  subscribeLogin(s) {
    this.subscriptions.push(s);
  }
  
  resolveSubs() {
    this.subscriptions.forEach(sub => {
      if (typeof sub === 'function') {
        sub();
      }
    });
  }
  
}
