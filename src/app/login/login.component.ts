import { Component } from '@angular/core';
import { LoginData } from '../interfaces/userData';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userService.setHeaderFooterState(true);
    }

    userCredentials: LoginData = {
        email: '',
        password: '',
    };

    pwdInputFlag: boolean = true;
    errCredentialsFlag: boolean = false;

    showPassword() {
        this.pwdInputFlag = !this.pwdInputFlag;
    }

    authenticateUser(form: NgForm) {
        if (form.invalid) {
            console.log('Errore');
            form.control.markAllAsTouched();
            this.errCredentialsFlag = true;
            return;
        }

        console.log(this.userCredentials);
        console.log('Puoi andare');

        this.authService.loginUser(this.userCredentials).subscribe({
            next: (data) => {
                console.log('User token', data);
                this.router.navigate(['/home']);
            },
            error: (error) => {
                console.log(error);
                this.errCredentialsFlag = true;
            },
        });
    }

    ngOnDestroy() {
        this.userService.setHeaderFooterState(false);
    }
}
