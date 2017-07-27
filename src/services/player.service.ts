import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

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
            return players.find(player => player.id === id);
        });
    }
}