import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerListComponent }   from '../components/player-list/player-list.component';
import { MatchReportComponent }   from '../components/match-report/match-report.component';

const routes: Routes = [
    { path: '', redirectTo: '/players', pathMatch: 'full' },
    { path: 'players',  children:
        [
            { path: '', component: PlayerListComponent,    pathMatch: 'full' },

        ]
    },
    { path: 'report/:p1/:p2', children:
        [
            { path: '', component: MatchReportComponent, pathMatch: 'full'}
        ]
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class RoutingModule {}