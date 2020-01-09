import { Component, OnInit } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo';
import { User } from 'src/app/interfaces/user';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { apiService } from 'src/app/services/api.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private matomoTracker: MatomoTracker,  private api: apiService, private authenticationService: AuthentificationService
  ) {}

  date: Date = new Date();
  user: User;

  ngOnInit() {
    this.authenticationService.setRouteLink('home');
    this.authenticationService.getUserInfos().subscribe(user => {
      this.user = user;
    });
    this.matomoTracker.setDocumentTitle('Page Home');
  }
}
