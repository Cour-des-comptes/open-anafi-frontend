import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthentificationService } from '../../services/authentification.service';

/**
 * @ignore
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    /**
     * Login component Test compodoc comment
     */
    submitted = false;
    loading = false;
    diameter = 30;
    error = ';';

    username = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required]);

    loginForm: FormGroup = new FormGroup({
        username: this.username,
        password: this.password
    });

    /**
     * @ignore
     */
    constructor(
        private authService: AuthentificationService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.logout();
    }


    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;

        this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
            .subscribe(
                _ => {
                    this.authService.getUserInfos()
                        .subscribe(
                            _ => {
                                this.router.navigate(['/home']);
                            });
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });


    }

}
