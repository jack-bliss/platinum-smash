import { Component } from '@angular/core';
import { Tiers } from '../../constants/tiers';

@Component({
    selector: 'view_tiers',
    styleUrls: ['./view-tiers.style.scss'],
    templateUrl: './view-tiers.template.html'
})
export class ViewTiersComponent{
    tiers: object[] = Tiers;
};
