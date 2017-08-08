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
import { EventManagerComponent } from "../components/event-manager/event-manager.component";
import { ViewMatchesComponent } from "../components/view-matches/view-matches.component";
import { FooterComponent } from "../components/footer/footer.component";

import { PlayerService } from "../services/player.service";
import { MatchService } from "../services/match.service";
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';
import { EventService } from '../services/event.service';
import { ExportService } from "../services/export.service";
import { TiersService } from "../services/tiers.service";

@NgModule({
    declarations: [
        AppComponent,
        PlayerListComponent,
        PlayerComponent,
        MatchReportComponent,
        ViewTiersComponent,
        AddPlayerComponent,
        LogInComponent,
        EventManagerComponent,
        ViewMatchesComponent,
        FooterComponent
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
        AuthService,
        CookieService,
        EventService,
        ExportService,
        TiersService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
