import { Component, OnInit } from "@angular/core";
import { Player } from '../../classes/player';
import { PlayerService } from "../../services/player.service";

@Component({
    selector: 'player-list',
    styleUrls: ['./player-list.style.scss'],
    templateUrl: 'player-list.template.html'
})
export class PlayerListComponent implements OnInit {

    constructor(private playerService: PlayerService){ }

    list: Player[];

    ngOnInit(){
        this.playerService.getPlayers().then(players => {
            this.list = players
        });
    }
}