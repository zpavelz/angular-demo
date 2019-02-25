import { Injectable                                     } from '@angular/core';
import { CanActivate, Router                            } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot    } from '@angular/router/src/router_state';

import { ApiService         } from './api.service';
import { MsgService         } from './msg.service';
import { testCredentials    } from './../../environments/environment';

const TOKEN = 'TOKEN';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    private _userEmail: string;
    static isLogged(): boolean {
        const tokenValue = localStorage.getItem(TOKEN);
        return (!!tokenValue);
    }
    static setToken(token): void {
        localStorage.setItem(TOKEN, token);
    }
    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    private static _generateNewToken(email: string, password: string) {
        return btoa(Math.random() + '' + email + password + '' + Math.random());
    }
    private _secureLogin(email, password) {
        this._sMsg.setSuccess('Successfully authorized');
        localStorage.setItem(this._userEmail, btoa(email));
        AuthGuardService.setToken(AuthGuardService._generateNewToken(email, password));
        this.router.navigate(['/']).catch(r => { console.log(r); });
        return true;
    }
    constructor(
        private router: Router,
        private _sApi: ApiService,
        private _sMsg: MsgService
    ) {
        this._userEmail = '_userEmail';
    }
    login(email: string, password: string) {
        this._sMsg.clearAll();
        if (!email || !password || !AuthGuardService.validateEmail(email)) {
            this._sMsg.setError('Wrong email format or empty password');
            return false;
        }
        if (email === this.getTestLoginValue() && password === this.getTestPasswordValue()) {
            return this._secureLogin(email, password);
        } else {
            const res = this._sApi.tryToLogin(email, password);
            if (!res) return false;
            res.subscribe(data => {
                    return this._secureLogin(email, password);
                },
                err => this._sMsg.setError(err.error.Message),
            );
        }
    }
    logout() {
        localStorage.setItem(this._userEmail, '');
        AuthGuardService.setToken('');
        return true;
    }
    getUserEmail() {
        return atob(localStorage.getItem(this._userEmail));
    }
    /**
     * Checker for Routing module
     * */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (AuthGuardService.isLogged()) {
            return true;
        }
        this.router.navigate(['/auth']).catch(r => { console.log(r); });
        return false;
    }
    getTestLoginValue() {
        return testCredentials.login;
    }
    getTestPasswordValue() {
        return testCredentials.pwd;
    }
}
