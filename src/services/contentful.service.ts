import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContentfulService{

    constructor(
        private http: Http
    ){ }

    getValue(key){
        return this.http.get('/api/contentful/lookup/'+key).toPromise().then(response => {
            if(response.json().success){
                return response.json().value;
            } else {
                return Promise.reject(response.json().error);
            }
        });
    }

}
