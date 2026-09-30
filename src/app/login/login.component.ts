import { Component } from '@angular/core';
import { LoginData } from '../interfaces/userData';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

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
                // this.cartService.mergeGuestCart();

                console.log('User token', data);
                this.router.navigate(['/home']);
            },
            error: (error) => {
                console.log(error);
                this.errCredentialsFlag = true;
            },
        });
    }
}
