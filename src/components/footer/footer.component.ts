import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'ps-footer',
  styleUrls: ['./footer.style.scss'],
  templateUrl: './footer.template.html'
})
export class FooterComponent implements OnInit {
  
  loggedIn = false;
  currentRoute = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.currentRoute = event.url.replace('/', '');
      }
    });
  }
  
  ngOnInit() {
    this.loggedIn = AuthService.loggedIn();
    this.authService.subscribeLogin(() => {
      this.loggedIn = AuthService.loggedIn();
    });
  }
}
