import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'log_in',
    styleUrls: ['./log-in.style.scss'],
    templateUrl: './log-in.template.html'
})
export class LogInComponent{
    password: number;

    attemptLogin(){

    }
};
