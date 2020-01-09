import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';
import { environment } from '../environments/environment';
import { MatomoInjector } from 'ngx-matomo';
import {CustomAlertService} from './services/alerts/custom-alert.service';
import {ToastrService} from 'ngx-toastr';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';

/**
 *  @ignore
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authenticationService: AuthentificationService,
              private matomoInjector: MatomoInjector,
              private customAlertService: CustomAlertService,
              private toast: ToastrService) {

    if (environment.envName != 'prod') {
      console.log(environment.envName);
    }


    if (environment.envName === 'recette') {
      this.matomoInjector.init('//webanalytics-test.ccomptes.fr/', 24);
    }

    if (environment.envName === 'preprod') {
      this.matomoInjector.init('//webanalytics.ccomptes.fr/', 51);
    }

    if (environment.envName === 'prod') {
      this.matomoInjector.init('//webanalytics.ccomptes.fr/', 63);
    }
  }

  ngOnInit() {

    // the second parameter 'fr-FR' is optional
    registerLocaleData(localeFr, 'fr-FR');
    this.customAlertService.getNotification().subscribe(errorToDisplay => {
      if (errorToDisplay !== null) {
        switch (errorToDisplay.type) {
          case 'error':
            this.toast.error(errorToDisplay.message);
            break;
          case 'warning':
            this.toast.warning(errorToDisplay.message);
            break;
          case 'success':
            this.toast.success(errorToDisplay.message);
            break;
          default:
            this.toast.info(errorToDisplay.message);
        }
      }

    });
  }
}
