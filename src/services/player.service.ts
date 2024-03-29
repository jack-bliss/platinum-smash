import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { AuthService } from './auth.service';
import { TiersService } from './tiers.service';

import 'rxjs/add/operator/toPromise';
import { Player } from '../classes/player';

@Injectable()
export class PlayerService {
  constructor(
    private http: Http,
    private tiersService: TiersService
  ) {
  }
  
  rebuild(tag) {
    if (typeof tag === 'undefined') {
      tag = '';
    }
    return this.http.get('/api/rebuild_players/' + tag).toPromise().then(response => {
      return response.json();
    });
  }
  
  getPlayers() {
    return new Promise(mainResolve => {
      Promise.all([
        this.tiersService.getTiers(),
        this.http.get('/api/players').toPromise()
      ]).then(response => {
        const data: any = response;
        const players: any = data[1].json();
        mainResolve(
          players.map(player => {
            return Object.assign({}, player, {
              tierName: data[0][player.tier].name,
              maxRank: data[0][player.tier].ranks,
              tierColor: data[0][player.tier].color
            });
          })
        );
      });
    });
  }
  
  getPlayer(id: number) {
    return this.getPlayers().then((data: Player[]) => {
      return data.filter(player => player.id === id)[0];
    });
  }
  
  playerWon(id) {
    return new Promise(mainResolve => {
      this.tiersService.getTiers().then(Tiers => {
        this.getPlayer(id).then(player => {
          player.rank++;
          if (Tiers[player.tier].ranks !== -1 && player.rank > Tiers[player.tier].ranks) {
            player.rank = 0;
            player.tier++;
          }
          
          const headers = new Headers({ 'Content-Type': 'application/json' });
          const options = new RequestOptions({ 'headers': headers });
          return this.http.post('/api/update/players', {
            action: 'set',
            id: player.id,
            data: {
              rank: player.rank,
              tier: player.tier
            },
            token: AuthService.token()
          }, options).toPromise().then(response => {
            return mainResolve(response.json());
          });
        });
      });
    });
  }
  
  playerLost(id) {
    return new Promise(mainResolve => {
      this.tiersService.getTiers().then(Tiers => {
        this.getPlayer(id).then(player => {
          if (Tiers[player.tier].cantloose) {
            return mainResolve({
              'success': false,
              'reason': 'Player can\'t loose ranks in this tier.'
            });
          } else {
            player.rank--;
            if (player.rank < 0) {
              player.tier--;
              player.rank = Tiers[player.tier].ranks;
            }
          }
  
          const headers = new Headers({ 'Content-Type': 'application/json' });
          const options = new RequestOptions({ 'headers': headers });
          return this.http.post('/api/update/players', {
            action: 'set',
            id: player.id,
            data: {
              rank: player.rank,
              tier: player.tier
            },
            token: AuthService.token()
          }, options).toPromise().then(response => {
            return mainResolve(response.json());
          });
          
        });
      });
    });
  }
  
  addPlayer(tag) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    return this.http.post('/api/update/players', {
      action: 'push',
      data: {
        tag: tag,
        rank: 0,
        tier: 0
      },
      token: AuthService.token()
    }, options).toPromise().then(response => {
      return Promise.resolve(response.json());
    });
  }
  
};
