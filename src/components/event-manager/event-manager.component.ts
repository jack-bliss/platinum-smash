import { Component, OnInit } from "@angular/core";
import { EventService } from '../../services/event.service';
import { ExportService } from '../../services/export.service';

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
        private exportService: ExportService
    ){ }

    select(id){
        this.selected = id;
        let event = this.events.filter(event => event.id === id)[0];
        EventService.selectEvent(event);
    }

    exportEvent(id){
        this.exportService.do(id).then(eventJSON => {
            let event:any = eventJSON;
            const EventFileData = new Blob([JSON.stringify(event)], <BlobPropertyBag>{
                encoding: 'UTF-8',
                type: 'text/plain;charset=utf-8'
            });
            const EventFileUrl = window.URL.createObjectURL(EventFileData);
            const d_a = document.createElement("a");
            d_a.setAttribute("href", EventFileUrl);
            d_a.setAttribute("download", event.name+".json");
            const ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            d_a.dispatchEvent(ev);
        });
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
