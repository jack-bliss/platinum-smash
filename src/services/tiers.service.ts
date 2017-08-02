import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class TiersService{
    constructor(
        private http: Http
    ){ }

    getTiers(){
        return this.http.get('/api/table/tiers').toPromise().then(tiers => {
            return Promise.resolve(tiers.json());
        });
    }
}