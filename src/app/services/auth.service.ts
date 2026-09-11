import { Injectable } from '@angular/core';
import {
    JwtPayload,
    LoginData,
    LoginResponse,
    UserData,
} from '../interfaces/userData';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly TOKEN_KEY = 'jwt_token';
    private apiBackendURL = 'http://localhost:8080/api/v1/auth';

    private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

    loggedIn$ = this.loggedIn.asObservable();

    constructor(private httpClient: HttpClient) {}

    setToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.loggedIn.next(true);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.loggedIn.next(false);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    registerUser(user: UserData): Observable<LoginResponse> {
        return this.httpClient
            .post<LoginResponse>(`${this.apiBackendURL}/register`, user)
            .pipe(tap((response) => this.setToken(response.token)));
    }

    loginUser(loginCredentials: LoginData): Observable<LoginResponse> {
        return this.httpClient
            .post<LoginResponse>(
                `${this.apiBackendURL}/authenticate`,
                loginCredentials,
            )
            .pipe(tap((response) => this.setToken(response.token)));
    }

    logout() {
        this.removeToken();
    }

    getUsername(): string {
        const token = this.getToken();

        if (!token) {
            return '';
        }

        const payload = jwtDecode<JwtPayload>(token);

        return payload.nome;
    }

    getProfile() {
        const token = this.getToken();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this.httpClient.get(`${this.apiBackendURL}/profile`, {
            headers,
        });
    }
}
