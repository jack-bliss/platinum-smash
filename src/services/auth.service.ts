import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { Md5 } from 'ts-md5/dist/md5';

import { CookieService } from './cookie.service';

import 'rxjs/add/operator/toPromise';

let loggedIn: boolean = false;
let token: number = null;


@Injectable()
export class AuthService{
    constructor(
        private http: Http
    ){

    }

    checkCookies(){
        return new Promise((resolve, reject) => {
            let cookieToken = parseInt(CookieService.get('token'), 10);
            let headers = new Headers({ 'Content-Type': 'application/json'});
            let options = new RequestOptions({ 'headers': headers });
            if(cookieToken){
                this.http.post('/api/verify_token', {
                    token: cookieToken
                }, options).toPromise().then(response => {
                    if(response.json().success){
                        loggedIn = true;
                        token = cookieToken;
                        CookieService.set('token', cookieToken, {
                            'max-age': 43200
                        });
                    }
                    resolve(true);
                });
            } else {
                resolve(true);
            }
        })
    }

    static hash(string){
        return Md5.hashStr(string);
    }

    auth(pw){
        const password = AuthService.hash(pw);
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ 'headers': headers });
        return this.http.post('/api/auth', {
            password: password
        }, options).toPromise().then(response => {
            let res = response.json();
            loggedIn = res.success;
            token = res.token;
            if(loggedIn){
                CookieService.set('token', token, {
                    'max-age': '43200'
                });
            }
            return response.json();
        });
    }

    static loggedIn(){
        return loggedIn;
    }

    static token(){
        return token;
    }

}
