import { Component, OnInit } from "@angular/core";
import { Player } from '../../classes/player';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from "../../services/player.service"

@Component({
    selector: 'match-report',
    styleUrls: ['./match-report.style.scss'],
    templateUrl: 'match-report.template.html'
})
export class MatchReportComponent implements OnInit {

    constructor(
        private playerService: PlayerService,
        private route: ActivatedRoute
    ){ }

    player1: Player;
    player2: Player;
    loading: boolean = true;

    ngOnInit(){

        this.route.params.subscribe(players => {

            // map ID strings to integers
            // let playerIDs = Object.entries(players).map(id => +id[1]);
            let playerIDs = [];
            for(var x in players){
                playerIDs.push(players[x]);
            }
            // get both players
            Promise.all(playerIDs.map(
                    id => this.playerService.getPlayer(id))
                ).then(players => {
                    this.player1 = <Player>players[0];
                    this.player2 = <Player>players[1];
                    this.loading = false;
                }
            );

        });

    }
}
