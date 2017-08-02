import { Injectable } from "@angular/core";
import { PlayerService } from './player.service';
import { EventService } from "./event.service";
import { MatchService } from "./match.service";

@Injectable()
export class ExportService{
    constructor(
        private playerService: PlayerService,
        private eventService: EventService,
        private matchService: MatchService
    ) { }

    do(id){
        return new Promise(mainResolve => {
            Promise.all([
                this.eventService.getEvent(id),
                this.playerService.getPlayers(),
                this.matchService.getMatchesByEvent(id)
            ]).then(data => {
                const matches:any = data[2];
                const participants:any = data[1];
                let o = {
                    name: data[0].name,
                    matches: matches.map(match => {
                        return {
                            winner_id: match.winnerId,
                            loser_id: match.loserId,
                            round: 0
                        }
                    }),
                    participants: participants.map(player => {
                        return {
                            display_name: player.tag,
                            id: player.id
                        }
                    })
                };
                mainResolve(o);
            });
        })
    }

}
