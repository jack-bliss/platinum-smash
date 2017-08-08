import { Router } from '@angular/router';

import { Component, OnInit } from "@angular/core";
import { Player } from '../../classes/player';
import { PlayerService } from "../../services/player.service";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'player-list',
    styleUrls: ['./player-list.style.scss'],
    templateUrl: 'player-list.template.html'
})
export class PlayerListComponent implements OnInit {

    constructor(
        private playerService: PlayerService,
        private authService: AuthService,
        private router: Router
    ){ }

    list: any;
    selected: number[] = [];
    loggedIn = false;

    select(id){
        if(this.loggedIn) {
            if(this.selected.indexOf(id) === -1){
                this.selected = [...this.selected, id];
                if (this.selected.length === 2) {
                    this.router.navigate(['/report', ...this.selected]);
                }
            } else {
                this.selected = [];
            }
        }
    }

    sort(field){
        if(field === 'tag'){
            this.list.sort((a, b) => {
                return a.tag.localeCompare(b.tag);
            });
        } else if(field === 'rank'){
            this.list.sort((a, b) => {
                if(a.tier > b.tier){
                    return -1;
                } else if(b.tier > a.tier){
                    return 1;
                } else if(a.tier === b.tier){
                    return b.rank-a.rank;
                }
            })
        }
    }

    ngOnInit(){
        this.playerService.getPlayers().then(players => {
            this.list = players;
            this.sort('rank');
        });
        this.loggedIn = AuthService.loggedIn();
        this.authService.subscribeLogin(() => {
            this.loggedIn = AuthService.loggedIn();
        });
    }

}
