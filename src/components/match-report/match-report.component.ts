import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Player } from '../../classes/player';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { MatchService } from '../../services/match.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Match } from '../../classes/match';

@Component({
  selector: 'ps-match-report',
  styleUrls: ['./match-report.style.scss'],
  templateUrl: 'match-report.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class MatchReportComponent implements OnInit {
  
  player1: Player;
  player2: Player;
  player1Score: number;
  player2Score: number;
  loading = true;
  loggedIn = true;
  noEvent = false;
  event = '';
  submitting = false;
  too_many = false;
  
  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }
  
  submit() {
    if (!this.submitting) {
      this.submitting = true;
      const p1score = this.player1Score || 0;
      const p2score = this.player2Score || 0;
      const winner = p1score > p2score ? this.player1.id : this.player2.id;
      const loser = p1score > p2score ? this.player2.id : this.player1.id;
      
      this.matchService.countMatches(this.player1.id, this.player2.id).then(count => {
        if (count < 5) {
          const match: Match = {
            player1Score: p1score,
            player2Score: p2score,
            player1Id: this.player1.id,
            player2Id: this.player2.id,
            winnerId: winner,
            loserId: loser,
            completed_at: Date.now(),
            eventid: EventService.selectedEvent().id,
          };
          return this.matchService.addMatch(match);
        } else {
          return Promise.reject(false);
        }
      }).then(response => {
        const repWin = this.playerService.playerWon(winner);
        const repLoss = this.playerService.playerLost(loser);
        return Promise.all([repWin, repLoss]);
      }, err => {
        return Promise.reject(false);
      }).then(response => {
        this.router.navigate(['/league']);
      }, err => {
        this.too_many = true;
      });
    }
  }
  
  ngOnInit() {
    
    if (AuthService.loggedIn() !== true) {
      this.loggedIn = false;
      return false;
    }
    if (EventService.selectedEvent() === null) {
      this.noEvent = true;
      return false;
    } else {
      this.event = EventService.selectedEvent().name;
    }
    
    this.route.params.subscribe(players => {
      
      // map ID strings to integers
      // let playerIDs = Object.entries(players).map(id => +id[1]);
      const playerIDs: number[] = [];
      for (const x in players) {
        if (players.hasOwnProperty(x)) {
          playerIDs.push(+players[x]);
        }
      }
      // get both players
      Promise.all(playerIDs.map(
        id => this.playerService.getPlayer(id))
      ).then((ps: Player[]) => {
          this.player1 = ps[0];
          this.player2 = ps[1];
          this.loading = false;
        }
      );
      
    });
    
  }
}
