import { Component, OnInit } from '@angular/core';

import { EventService } from '../../services/event.service';
import { ContentfulService } from '../../services/contentful.service';

@Component({
  selector: 'ps-home',
  styleUrls: ['./home.style.scss'],
  templateUrl: './home.template.html'
})
export class HomeComponent implements OnInit {
  
  events: any[];
  header_src: string;
  
  constructor(
    private eventService: EventService,
    private contentfulService: ContentfulService
  ) {
  }
  
  ngOnInit() {
    this.eventService.getUpcomingEvents().then(events => {
      this.events = events.map(event => {
        const date = event.date.split('-');
        const day = date[2].split('T')[0];
        const time = date[2].split('T')[1];
        return {
          name: event.name,
          link: event.link,
          date: day + '/' + date[1] + '/' + date[0] + ' @ ' + time
        };
      });
    });
    
    this.contentfulService.getValue('header_img').then(src => {
      this.header_src = src;
    }, err => {
      console.error(err);
    });
  }
  
};
