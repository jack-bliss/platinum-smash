import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.styles.scss'],
    templateUrl: './app.template.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    title: string = "Brighton Stock";
    ready: boolean = false;
    currentRoute: string = "";

    constructor(
        private authService: AuthService,
        private router: Router
    ){
        this.router.events.subscribe(event => {
            if(event instanceof NavigationStart){
                this.currentRoute = event.url.replace('/', '');
            }
        });
    }

    ngOnInit(){
        this.authService.checkCookies().then(data => {
            this.ready = true;
        });
    }
};
