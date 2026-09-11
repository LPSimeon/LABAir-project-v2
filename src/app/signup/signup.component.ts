import { Component } from '@angular/core';
import { UserData } from '../interfaces/userData';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: false,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
})
export class SignupComponent {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userService.setHeaderFooterState(true);
    }

    user: UserData = {
        nome: '',
        cognome: '',
        email: '',
        password: '',
        data_nascita: '',
    };

    giorno: string = '';
    mese: string = '';
    anno: string = '';

    pwdInputFlag: boolean = true;
    dateInputFlag: boolean = true;
    privacyTermsFlag: boolean = false;

    showPassword() {
        this.pwdInputFlag = !this.pwdInputFlag;
    }

    // Method to block the user to insert any alphabetic characters
    checkInputDateLetters(e: KeyboardEvent) {
        if (
            e.key == 'Backspace' ||
            e.key == 'Delete' ||
            e.key == 'Tab' ||
            e.key == 'Escape' ||
            e.key == 'Enter' ||
            e.key == 'ArrowLeft' ||
            e.key == 'ArrowRight'
        ) {
            return;
        }
        if (e.key < '0' || e.key > '9') {
            e.preventDefault();
        }
    }

    checkInputDateValue() {
        let giorno = parseInt(this.giorno, 10);
        let mese = parseInt(this.mese, 10);
        let anno = parseInt(this.anno, 10);

        if (this.giorno.length > 0) {
            if (giorno === 0) {
                this.giorno = '1';
                giorno = 1;
            } else if (giorno > 31) {
                this.giorno = '31';
                giorno = 31;
            }
        }

        if (this.mese.length > 0) {
            if (mese === 0) {
                this.mese = '1';
                mese = 1;
            } else if (mese > 12) {
                this.mese = '12';
                mese = 12;
            }
        }

        if (mese > 12) {
            this.mese = '12';
            this.dateInputFlag = false;
            return;
        }
        if (this.anno?.length === 4) {
            if (anno < 1900) {
                this.anno = '1900';
                anno = 1900;
            } else if (anno > 2026) {
                this.anno = '2026';
                anno = 2026;
            }
        }

        if (!giorno || !mese || !anno || this.anno?.length < 4) {
            // this.dateInputFlag = true;
            return;
        }

        // Last check if the Date inserted is correct
        const dateCheck = new Date(anno, mese - 1, giorno);
        const today = new Date();

        if (
            dateCheck.getFullYear() === anno &&
            dateCheck.getMonth() === mese - 1 &&
            dateCheck.getDate() === giorno &&
            dateCheck.getTime() <= today.getTime()
        ) {
            this.dateInputFlag = true;
            this.user.data_nascita = `${anno}-${String(mese).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
        } else {
            this.dateInputFlag = false;
        }
    }

    setPrivacyTermsInput() {
        this.privacyTermsFlag = !this.privacyTermsFlag;
    }

    saveNewUser(form: NgForm) {
        if (form.invalid && this.privacyTermsFlag == false) {
            console.log('Errore');
            this.privacyTermsFlag = false;
            form.control.markAllAsTouched();
            return;
        }

        console.log(this.user);
        console.log('Puoi andare');
        this.authService.registerUser(this.user).subscribe({
            next: (data) => {
                console.log('Ok', data);
                this.authService.setToken(data.token);
                // console.log(this.authService.getToken());
                // console.log(this.authService.isLoggedIn());
                this.router.navigate(['/home']);
            },
            error: (error) => console.log(error),
        });
    }

    ngOnDestroy() {
        this.userService.setHeaderFooterState(false);
        // this.userService
    }
}
