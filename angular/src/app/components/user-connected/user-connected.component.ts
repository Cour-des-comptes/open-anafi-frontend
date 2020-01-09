import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-connected',
  templateUrl: './user-connected.component.html',
  styleUrls: ['./user-connected.component.scss']
})
export class UserConnectedComponent implements OnInit {

  constructor(private authService: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router) {
  }


  userConnected: any;

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(data => {
      this.userConnected = data;
    });

    if (this.authService.isUserConnected()) {
      this.authService.getUserInfos().subscribe();
    } else {
      this.authService.logout();
    }


  }

  onSubmit() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
