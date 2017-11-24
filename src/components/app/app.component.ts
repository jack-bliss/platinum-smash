import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'ps-app',
  styleUrls: ['./app.styles.scss'],
  templateUrl: './app.template.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  
  title = 'Brighton Stock';
  ready = false;
  currentRoute = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.currentRoute = event.url.replace('/', '');
      }
    });
  }
  
  ngOnInit() {
    this.authService.checkCookies().then(data => {
      this.ready = true;
    });
  }
}
