import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // private apiBackendURL = 'http://localhost:8080/api/v1/utente';

    // constructor(
    //     private httpClient: HttpClient,
    //     private authService: AuthService,
    // ) {}

    private hfState = new BehaviorSubject<boolean>(false);
    hfState$ = this.hfState.asObservable(); // Header-Footer-State

    setHeaderFooterState(state: boolean) {
        this.hfState.next(state);
    }
}
