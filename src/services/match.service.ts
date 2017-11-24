import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { AuthService } from './auth.service';

import 'rxjs/add/operator/toPromise';
import { Match } from '../classes/match';

@Injectable()
export class MatchService {
  constructor(
    private http: Http
  ) {
  }
  
  deleteAndRebuild(id) {
    return this.http.get('/api/delete_match/' + id).toPromise().then(response => {
      return response.json();
    });
  }
  
  countMatches(p1, p2) {
    return this.http.get('/api/count_matches/' + p1 + '/' + p2).toPromise().then(response => {
      return response.json().count;
    });
  }
  
  getMatches() {
    return this.http.get('/api/table/matches').toPromise().then(matches => {
      return matches.json();
    });
  }
  
  getMatchesByEvent(id) {
    return new Promise(mainResolve => {
      this.getMatches().then(matches => {
        mainResolve(matches.filter(match => match.eventid === id));
      });
    });
  }
  
  addMatch(match: Match) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    console.log(match);
    return this.http.post('/api/update/matches', Object.assign({}, {
      action: 'push',
      data: match,
      token: AuthService.token()
    }), options).toPromise().then(results => {
      console.log(results.json());
      return results.json();
    });
  }
  
}
