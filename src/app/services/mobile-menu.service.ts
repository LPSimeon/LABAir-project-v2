import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MobileMenuService {
    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    get isOpen(): boolean {
        return this.isOpenSubject.value;
    }

    open() {
        this.isOpenSubject.next(true);
    }
    close() {
        this.isOpenSubject.next(false);
    }
}
