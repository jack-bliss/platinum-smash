import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.styles.scss'],
    templateUrl: './app.template.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    title: string = "Platinum Smash";
    ready: boolean = false;

    constructor(
        private authService: AuthService
    ){ }

    ngOnInit(){

        this.authService.checkCookies().then(data => {
            this.ready = true;
        });

    }
};
