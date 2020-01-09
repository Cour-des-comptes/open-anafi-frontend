import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(private router: Router, private auth_service: AuthentificationService) { }
  admin: boolean;
  routerlink: String;

  ngOnInit() {
    this.auth_service.getRouteLink().subscribe(value => {

      this.routerlink = value;
    });

    this.auth_service.authenticatedUser.subscribe(user => {
      this.admin = user.isAdmin;
    });

  }
}
