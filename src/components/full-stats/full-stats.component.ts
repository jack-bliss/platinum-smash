import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../../services/player.service';

import { TooltipModule } from 'ng2-tooltip';

@Component({
    selector: 'full_stats',
    styleUrls: ['./full-stats.style.scss'],
    templateUrl: './full-stats.template.html'
})
export class FullStatsComponent implements OnInit{

    players:any;

    constructor(
        private playerService: PlayerService
    ){ }

    ngOnInit(){
        this.playerService.getPlayers().then((players: any[]) => {

            this.players = players.sort((a, b) => {
                if(a.wins.length === b.wins.length){
                    return a.losses.length - b.losses.length;
                } else {
                    return b.wins.length - a.wins.length;
                }
            }).map(player => {
                let short_tag = player.tag[0];
                for(var i = 1; i < player.tag.length; i++){
                    if(player.tag[i].toUpperCase() === player.tag[i]){
                        short_tag += player.tag[i];
                    }
                }

                return Object.assign(player, {
                    short_tag: short_tag
                })
            });
        })
    }

    adv(setcount){
        if(setcount === '' || setcount === "0-0"){
            return '';
        }
        var split = setcount.split("-").map(n => parseInt(n));
        if(split[0] > split[1]){
            return "win";
        } else if(split[0] === split[1]){
            return "even";
        } else {
            return "loss";
        }
    }

    setCount(id1, id2){
        if(id1 === id2){
            return '';
        }
        const p1 = this.players.find(player => player.id === id1);
        const p2 = this.players.find(player => player.id === id2);

        var p1_wins = p1.wins.reduce((n, ag) => {
            if(ag === id2){
                return n+1;
            }
            return n;
        }, 0);
        var p2_wins = p2.wins.reduce((n, ag) => {
            if(ag === id1){
                return n+1;
            }
            return n;
        }, 0);
        return p1_wins + "-" + p2_wins;
    }
};
