import { Component, OnInit } from "@angular/core";

import { MatchService } from "../../services/match.service";
import { PlayerService } from "../../services/player.service";
import { EventService } from "../../services/event.service";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'view-matches',
    styleUrls: ['./view-matches.style.scss'],
    templateUrl: './view-matches.template.html'
})
export class ViewMatchesComponent implements OnInit{

    matches: any = [];
    loggedIn = false;

    constructor(
        private matchService: MatchService,
        private playerService: PlayerService,
        private eventService: EventService
    ){ }

    deleteMatch(id){
        this.matchService.deleteAndRebuild(id).then(response => {
            this.matches = this.matches.filter(match => match.id !== id);
        });
    }

    ngOnInit(){

        Promise.all([
            this.matchService.getMatches(),
            this.playerService.getPlayers(),
            this.eventService.getEvents()
        ]).then(response => {
            this.loggedIn = AuthService.loggedIn();
            this.matches = response[0].map(match => {
                const players:any = response[1];
                const events:any = response[2];
                const p1tag = players.filter(player => {
                    return player.id === match.player1id;
                })[0].tag;
                const p2tag = players.filter(player => {
                    return player.id === match.player2id;
                })[0].tag;

                const ename = events.filter(event => {
                    return event.id === match.eventid;
                })[0].name;

                let t = new Date(parseInt(match.completed_at));

                return Object.assign({}, match, {
                    player1tag: p1tag,
                    player2tag: p2tag,
                    eventname: ename,
                    completed: t.toDateString() + ', ' + t.getHours() + ':' + t.getMinutes()
                })
            }).reverse();
        });
    }
}