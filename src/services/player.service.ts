import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { Tiers } from '../constants/tiers';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlayerService{
    constructor(private http: Http){ }

    getPlayers(){
        return this.http.get('/api/table/players').toPromise().then(players => {
            return players.json();
        });
    }

    getPlayer(id){
        return this.getPlayers().then(players => {
            return players.filter(player => player.id === id)[0];
        });
    }

    playerWon(id){
        this.getPlayer(id).then(player => {
            player.rank++;
            if(Tiers[player.tier].ranks !== -1 && player.rank >= Tiers[player.tier].ranks){
                player.rank = 0;
                player.tier++;
            }

            let headers = new Headers({ 'Content-Type': 'application/json'});
            let options = new RequestOptions({ 'headers': headers });
            return this.http.post('/api/update/players', {
                action: 'set',
                id: player.id,
                data: player
            }).toPromise();
        });
    }

    playerLost(id){
        return new Promise(resolve => {
            resolve(true);
        })
    }

}
