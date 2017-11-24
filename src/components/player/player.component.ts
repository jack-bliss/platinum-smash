import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../classes/player';

@Component({
  selector: 'ps-player',
  styleUrls: ['./player.style.scss'],
  templateUrl: './player.template.html'
})
export class PlayerComponent implements OnInit {
  
  @Input() player: Player;
  @Input() selectable = false;
  cssClass: string[] = ['player'];
  
  prevent(e) {
    e.preventDefault();
  }
  
  clicked() {
    if (this.selectable && this.cssClass.indexOf('selected') === -1) {
      this.cssClass = [...this.cssClass, 'selected'];
    } else {
      this.cssClass = this.cssClass.filter(c => c !== 'selected');
    }
  }
  
  ngOnInit() {
    if (this.selectable) {
      this.cssClass = [...this.cssClass, 'selectable'];
    }
  }
}
