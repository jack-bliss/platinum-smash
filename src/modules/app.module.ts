import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RoutingModule } from "./routing.module";

import { AppComponent } from '../components/app/app.component';
import { PlayerListComponent } from '../components/player-list/player-list.component';
import { PlayerComponent } from '../components/player/player.component';
import { MatchReportComponent } from '../components/match-report/match-report.component';
import { ViewTiersComponent } from '../components/view-tiers/view-tiers.component';
import { AddPlayerComponent } from '../components/add-player/add-player.component';
import { LogInComponent } from "../components/log-in/log-in.component";

import { PlayerService } from "../services/player.service";
import { MatchService } from "../services/match.service";
import { AuthService } from '../services/auth.service';

@NgModule({
    declarations: [
        AppComponent,
        PlayerListComponent,
        PlayerComponent,
        MatchReportComponent,
        ViewTiersComponent,
        AddPlayerComponent,
        LogInComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RoutingModule
    ],
    providers: [
        PlayerService,
        MatchService,
        AuthService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
