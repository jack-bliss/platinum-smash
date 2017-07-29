import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PlayerService } from '../../services/player.service';

@Component({
    selector: 'add_player',
    styleUrls: ['./add-player.style.scss'],
    templateUrl: './add-player.template.html'
})
export class AddPlayerComponent{

    constructor(
        private playerService: PlayerService,
        private router: Router
    ){ }

    tag: string = '';

    addPlayer(){
        this.playerService.addPlayer(this.tag).then(response => {
            console.log(response);
            this.router.navigate(['/players']);
        })
    }
};
