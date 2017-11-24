import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'ps-add-player',
  styleUrls: ['./add-player.style.scss'],
  templateUrl: './add-player.template.html'
})
export class AddPlayerComponent {
  
  tag = '';
  submitting = false;
  
  constructor(
    private playerService: PlayerService,
    private router: Router
  ) {
  }
  
  addPlayer() {
    if (!this.submitting) {
      this.playerService.addPlayer(this.tag).then(response => {
        this.router.navigate(['/players']);
      });
    }
  }
};
