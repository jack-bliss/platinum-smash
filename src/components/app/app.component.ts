import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.styles.scss'],
    templateUrl: './app.template.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    constructor(
        private authService: AuthService
    ){ }

    title: string = "Platinum Smash";

    ngOnInit(){
        /*
        TODO:
            NPM:
            = cookies
            Server:
            = update server to check cookies
            = update how sessions expire - setInterval checking against Date.now()+interval?
            Routing:
            = add /login route
            = add link from /players to /login
            Components:
            = finish log-in componet

        check cookies for token
        if there:
            refresh token and cookie lifetime
            declare self logged in
        if none:
            redirect to /playerlist

        */
    }
};
