import { Injectable         } from '@angular/core';
import { RoleService        } from './role.service';
import { AuthGuardService   } from './authguard.service';
import { InfUser            } from './../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _cUser: InfUser;
    constructor(private _sAuthGuard: AuthGuardService) {
        this._fillUserData();
    }
    private _fillUserData() {
        this._cUser = {
            name: this._sAuthGuard.getUserEmail(),
            role: RoleService.getAdminID()
        };
    }
    get name(): string { return this.getName(); }
    get role(): string { return RoleService.getNameByID(this._cUser.role); }
    getName() {
        if (!this._cUser.name) {
            this._fillUserData();
        }
        return this._cUser.name;
    }
    isAuth() {
        return AuthGuardService.isLogged();
    }
}
