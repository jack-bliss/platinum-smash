import { Component, OnInit } from "@angular/core";
import { Http } from '@angular/http';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'event-manager',
    styleUrls: ['./event-manager.style.scss'],
    templateUrl: './event-manager.template.html'
})
export class EventManagerComponent implements OnInit {

    events;
    selected;
    new_name;

    constructor(
        private eventService: EventService,
        private http: Http
    ){ }

    select(id){
        this.selected = id;
        let event = this.events.filter(event => event.id === id)[0];
        EventService.selectEvent(event);
    }

    addEvent(){
        this.eventService.addEvent(this.new_name).then(response => {
            this.loadEvents();
            this.new_name = '';
        })
    }

    loadEvents(){
        this.eventService.getEvents().then(events => {
            this.events = events;
        });
    }

    ngOnInit(){
        this.loadEvents();
        if(EventService.selectedEvent()) {
            this.selected = EventService.selectedEvent().id;
        }
    }

}
