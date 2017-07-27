import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RoutingModule } from "./routing.module";

import { AppComponent } from '../components/app/app.component';
import { PlayerListComponent } from '../components/player-list/player-list.component';
import { PlayerComponent } from '../components/player/player.component';
import { MatchReportComponent } from '../components/match-report/match-report.component';

import { PlayerService } from "../services/player.service";

@NgModule({
    declarations: [
        AppComponent,
        PlayerListComponent,
        PlayerComponent,
        MatchReportComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RoutingModule
    ],
    providers: [ PlayerService ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
