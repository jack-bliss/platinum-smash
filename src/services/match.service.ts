import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";

import { AuthService } from "./auth.service";
import { EventService } from "./event.service";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MatchService{
    constructor(
        private http: Http,
        private eventService: EventService
    ) { }

    getMatches(){
        return this.http.get('/api/table/matches').toPromise().then(matches => {
            return matches.json();
        });
    }

    addMatch(match){
        let fullMatch = Object.assign({}, match, {
            completedAt: EventService.selectedEvent().id
        });
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ 'headers': headers });
        return this.http.post('/api/update/matches', Object.assign({}, {
            action: 'push',
            data: fullMatch,
            token: AuthService.token()
        }), options).toPromise().then(results => {
            return results.json();
        });
    }

}
