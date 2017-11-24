import { Component, OnInit } from '@angular/core';
import { TiersService } from '../../services/tiers.service';

@Component({
  selector: 'ps-view-tiers',
  styleUrls: ['./view-tiers.style.scss'],
  templateUrl: './view-tiers.template.html'
})
export class ViewTiersComponent implements OnInit {
  tiers: object[];
  
  constructor(
    private tiersService: TiersService
  ) {
  }
  
  ngOnInit() {
    this.tiersService.getTiers().then(tiers => {
      this.tiers = tiers;
    });
  }
};
