import { Component, OnInit } from '@angular/core';
import { TiersService } from '../../services/tiers.service';

@Component({
    selector: 'view_tiers',
    styleUrls: ['./view-tiers.style.scss'],
    templateUrl: './view-tiers.template.html'
})
export class ViewTiersComponent implements OnInit{
    constructor(
        private tiersService: TiersService
    ){  }
    tiers: object[];

    ngOnInit(){
        this.tiersService.getTiers().then(tiers => {
            this.tiers = tiers;
        })
    }
};
