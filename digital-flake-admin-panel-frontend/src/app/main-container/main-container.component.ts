import { Component, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent {

  ShowHeader = false;
  ShowMenu = false;
  ShowFooter = false;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url == '/login' || val.urlAfterRedirects =="/login" ||val.url == '/registration' ||val.url.split('?')[0] == '/forgot_password' || val.url == '/' || val.url == '/error' || val.urlAfterRedirects =="/error" ) {
          this.ShowHeader = false;
          this.ShowMenu = false;
          this.ShowFooter = false;
        }
        else {
          this.ShowHeader = true;
          this.ShowMenu = true;
          this.ShowFooter = true;
        }
      }
    })
  }
}
