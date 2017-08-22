import { Component, OnInit } from '@angular/core';

import { EventService } from '../../services/event.service';

@Component({
    selector: 'home',
    styleUrls: ['./home.style.scss'],
    templateUrl: './home.template.html'
})
export class HomeComponent implements OnInit{

    events:any[];

    constructor(
        private eventService: EventService
    ){
        
    }

    ngOnInit(){
        this.eventService.getUpcomingEvents().then(events => {
            this.events = events.map(event => {
                var date = event.date.split("-");
                var day = date[2].split("T")[0];
                var time = date[2].split("T")[1];
                return {
                    name: event.name,
                    link: event.link,
                    date: day+"/"+date[1]+"/"+date[0]+" @ "+time
                }
            });
        });
    }

};
