import { Component, Input, OnInit } from "@angular/core";
import { Player } from '../../classes/player';

@Component({
    selector: 'player',
    styleUrls: ['./player.style.scss'],
    templateUrl: './player.template.html'
})
export class PlayerComponent implements OnInit{

    @Input() player: Player;
    @Input() selectable: boolean = false;
    class: string[] = ['player'];

    prevent(e){
        e.preventDefault();
    }

    clicked(){
        if(this.selectable && this.class.indexOf('selected') === -1){
            this.class = [...this.class, 'selected'];
        } else {
            this.class = this.class.filter(c => c !== 'selected');
        }
    }

    ngOnInit(){
        if(this.selectable){
            this.class = [...this.class, 'selectable'];
        }
    }
}
