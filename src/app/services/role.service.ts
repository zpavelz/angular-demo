import { Injectable } from '@angular/core';
import { RoleIds } from '../constants/role-ids.constants';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    static getNameByID(roleID): string {
        switch (roleID) {
            case RoleIds.ADMIN:
                return 'Admin';
            case RoleIds.EMPLOYEE:
                return 'Employee';
            case RoleIds.PM:
                return 'Project Manager';
        }
    }
    static getAdminID(): number {
        return RoleIds.ADMIN;
    }
}
