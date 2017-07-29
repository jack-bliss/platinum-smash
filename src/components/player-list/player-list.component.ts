import { ActivatedRoute, Router } from '@angular/router';

import { Component, OnInit } from "@angular/core";
import { Player } from '../../classes/player';
import { PlayerService } from "../../services/player.service";

@Component({
    selector: 'player-list',
    styleUrls: ['./player-list.style.scss'],
    templateUrl: 'player-list.template.html'
})
export class PlayerListComponent implements OnInit {

    constructor(
            private playerService: PlayerService,
            private route: ActivatedRoute,
            private router: Router
    ){ }

    list: Player[];
    selected: number[] = [];

    select(id){
        
        this.selected = [...this.selected, id];

        if(this.selected.length === 2){
            this.router.navigate(['/report', ...this.selected]);
        }
    }

    getClass(id){

    }

    ngOnInit(){
        console.log('reloading');
        this.playerService.getPlayers().then(players => {
            this.list = players;
        });
    }
}
