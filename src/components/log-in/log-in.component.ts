import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'log-in',
    styleUrls: ['./log-in.style.scss'],
    templateUrl: './log-in.template.html'
})
export class LogInComponent implements OnInit{

    password: string;
    failed: boolean = false;
    loggedIn = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    attemptLogin(){
        this.authService.auth(this.password).then(response => {
            if(response.success){
                this.router.navigate(['/league']);
            } else {
                this.failed = true;
                this.password = '';
            }
        })
    }

    ngOnInit(){
        this.loggedIn = AuthService.loggedIn();
    }
};
