import { Component, Input } from "@angular/core";
import { Player } from '../../classes/player';

@Component({
    selector: 'player',
    styleUrls: ['./player.style.scss'],
    templateUrl: './player.template.html'
})
export class PlayerComponent{
    @Input() player: Player;
}