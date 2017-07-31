import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { Md5 } from 'ts-md5/dist/md5';

import 'rxjs/add/operator/toPromise';

let loggedIn: boolean = false;
let token: string = null;


@Injectable()
export class AuthService{
    constructor(private http: Http){ }

    hash(string){
        return Md5.hashStr(string);
    }

    auth(pw){
        const password = this.hash(pw);
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ 'headers': headers });
        return this.http.post('/api/auth', {
            password: password
        }, options).toPromise().then(response => {
            let res = response.json();
            loggedIn = res.success;
            token = res.token;
            return response.json();
        });
    }

    loggedIn(){
        return loggedIn;
    }

    token(){
        return token;
    }

}
