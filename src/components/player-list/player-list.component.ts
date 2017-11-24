import { Router } from '@angular/router';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'ps-player-list',
  styleUrls: ['./player-list.style.scss'],
  templateUrl: 'player-list.template.html',
  encapsulation: ViewEncapsulation.None
})
export class PlayerListComponent implements OnInit {
  
  list: any;
  selected: number[] = [];
  loggedIn = false;
  eventSelected = false;
  error: string = null;

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) {
  }
  
  select(id) {
    if (this.loggedIn && this.eventSelected) {
      this.error = null;
      if (this.selected.indexOf(id) === -1) {
        this.selected = [...this.selected, id];
        if (this.selected.length === 2) {
          this.router.navigate(['/report', ...this.selected]);
        }
      } else {
        this.selected = [];
      }
    } else {
      this.error = 'Please select an event before registering a match.';
    }
  }
  
  sort(field: string) {
    if (field === 'tag') {
      this.list.sort((a, b) => {
        return a.tag.localeCompare(b.tag);
      });
    } else if (field === 'rank') {
      this.list.sort((a, b) => {
        if (a.tier > b.tier) {
          return -1;
        } else if (b.tier > a.tier) {
          return 1;
        } else if (a.tier === b.tier) {
          return b.rank - a.rank;
        }
      });
    } else if (field === 'wins') {
      this.list.sort((a, b) => {
        if (b.wins.length === a.wins.length) {
          return a.losses.length - b.losses.length;
        } else {
          return b.wins.length - a.wins.length;
        }
      });
    }
  }
  
  ngOnInit() {
    this.playerService.getPlayers().then(players => {
      this.list = players;
      this.sort('wins');
      this.list.forEach((player, index) => {
        player.position = index + 1;
      });
    });
    this.loggedIn = AuthService.loggedIn();
    this.authService.subscribeLogin(() => {
      this.loggedIn = AuthService.loggedIn();
    });
    this.eventSelected = EventService.selectedEvent();
  }
  
}
