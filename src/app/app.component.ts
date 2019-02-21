import { Component          } from '@angular/core';
import { UserService        } from './services/user.service';
import { AuthGuardService   } from './services/authguard.service';
import { MsgService         } from './services/msg.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private _sUser: UserService, private _sAuthGuard: AuthGuardService, public sMsg: MsgService) {
    }
    get userName(): string { return this._sUser.name; }
    get userRole(): string { return this._sUser.role; }
    isUserAuth() {
        return this._sUser.isAuth();
    }
    logout() {
        this._sAuthGuard.logout();
        document.location.href = '/';
    }
}
