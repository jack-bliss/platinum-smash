import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { AuthService } from './auth.service';

import 'rxjs/add/operator/toPromise';

let selectedEvent = null;

@Injectable()
export class EventService {
  constructor(
    private http: Http
  ) {
  }
  
  static selectedEvent() {
    return selectedEvent;
  }
  
  static selectEvent(event) {
    selectedEvent = event;
  }
  
  getUpcomingEvents() {
    return this.http.get('/api/contentful/events').toPromise().then(events => {
      return events.json();
    });
  }
  
  getEvent(id) {
    return this.getEvents().then(events => {
      return events.filter(event => event.id === id)[0];
    });
  }
  
  getEvents() {
    return this.http.get('/api/table/events').toPromise().then(events => {
      return events.json();
    });
  }
  
  addEvent(info) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    return this.http.post('/api/update/events', {
      action: 'push',
      data: info,
      token: AuthService.token()
    }, options).toPromise().then(results => {
      return results.json();
    });
  }
  
}
