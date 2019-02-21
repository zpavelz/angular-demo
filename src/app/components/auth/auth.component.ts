import { Component          } from '@angular/core';
import { AuthGuardService   } from './../../services/authguard.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent {
    email: string;
    password: string;
    testLogin: string;
    testPassword: string;
    constructor(private _sAuthGuard: AuthGuardService) {
        this.email          = '';
        this.password       = '';
        this.testLogin      = this._sAuthGuard.getTestLoginValue();
        this.testPassword   = this._sAuthGuard.getTestPasswordValue();
    }

    tryLogin() {
        this._sAuthGuard.login(
            this.email,
            this.password
        );
    }
}
