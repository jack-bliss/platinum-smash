import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.styles.scss'],
    templateUrl: './app.template.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    constructor(){ }
    title: string = "Platinum Smash";
};
