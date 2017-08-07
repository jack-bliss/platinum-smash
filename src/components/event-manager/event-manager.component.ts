import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ExportService } from '../../services/export.service';
import { PlayerService } from "../../services/player.service";

@Component({
    selector: 'event-manager',
    styleUrls: ['./event-manager.style.scss'],
    templateUrl: './event-manager.template.html'
})
export class EventManagerComponent implements OnInit {

    events;
    selected;
    new_name;
    new_tags;
    with_tag;

    constructor(
        private eventService: EventService,
        private exportService: ExportService,
        private playerService: PlayerService,
        private router: Router
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
        this.eventService.addEvent({
            name: this.new_name,
            tags: this.new_tags
        }).then(response => {
            this.loadEvents();
            this.new_name = '';
            this.new_tags = '';
        });
    }

    rebuild(){
        this.playerService.rebuild(this.with_tag).then(response => {
            this.router.navigate(['/players']);
        });
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
