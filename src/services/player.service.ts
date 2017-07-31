import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { Tiers } from '../constants/tiers';

import { AuthService } from "./auth.service";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlayerService{
    constructor(
        private http: Http,
        private authService: AuthService
    ) { }

    getPlayers(){
        return this.http.get('/api/table/players').toPromise().then(players => {
            return players.json().map(player => {
                return Object.assign({}, player, {
                    tierName: Tiers[player.tier].name,
                    maxRank: Tiers[player.tier].ranks
                })
            });
        });
    }

    getPlayer(id){
        return this.getPlayers().then(players => {
            return players.filter(player => player.id === id)[0];
        });
    }

    playerWon(id){
        return new Promise(mainResolve => {
            this.getPlayer(id).then(player => {
                player.rank++;
                if(Tiers[player.tier].ranks !== -1 && player.rank > Tiers[player.tier].ranks){
                    player.rank = 0;
                    player.tier++;
                }

                let headers = new Headers({ 'Content-Type': 'application/json'});
                let options = new RequestOptions({ 'headers': headers });
                return this.http.post('/api/update/players', {
                    action: 'set',
                    id: player.id,
                    data: player,
                    token: this.authService.token()
                }, options).toPromise().then(response => {
                    return mainResolve(response.json());
                });
            });
        });
    }

    playerLost(id){
        return new Promise(mainResolve => {
            this.getPlayer(id).then(player => {

                if(Tiers[player.tier].cantloose){
                    return mainResolve({
                        "success": false,
                        "reason": "Player can't loose ranks in this tier."
                    });
                } else {
                    player.rank--;
                    if(player.rank < 0){
                        player.tier--;
                        player.rank = Tiers[player.tier].ranks;
                    }
                }

                let headers = new Headers({ 'Content-Type': 'application/json'});
                let options = new RequestOptions({ 'headers': headers });
                return this.http.post('/api/update/players', {
                    action: 'set',
                    id: player.id,
                    data: player,
                    token: this.authService.token()
                }, options).toPromise().then(response => {
                    return mainResolve(response.json());
                });

            });
        });
    }

    addPlayer(tag){
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ 'headers': headers });
        return this.http.post('/api/update/players', {
            action: 'push',
            data: {
                tag: tag,
                rank: 0,
                tier: 0
            }
        }, options).toPromise().then(response => {
            return Promise.resolve(response.json());
        });
    }

};
