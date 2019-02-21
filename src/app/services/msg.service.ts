import { Injectable     } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MsgService {
    private _errors:    string[];
    private _success:   string[];
    private _clearAfterSeconds: number;
    constructor() {
        this._errors    = [];
        this._success   = [];
        this._clearAfterSeconds = 5;
    }
    getErrors() {
        return this._errors;
    }
    getSuccesses() {
        return this._success;
    }
    hasErrors(): boolean {
        return (this._errors.length > 0);
    }
    hasSuccesses(): boolean {
        return (this._success.length > 0);
    }
    clearAll() {
        this.clearSuccesses();
        this.clearError();
    }
    setError(msg: string, clearAfter: boolean = true) {
        this._setToStorage(this._errors, msg, clearAfter);
    }
    setSuccess(msg: string, clearAfter: boolean = true) {
        this._setToStorage(this._success, msg, clearAfter);
    }
    clearError(msg: string = null) {
        this._clearStorage(this._errors, msg);
    }
    clearSuccesses(msg: string = null) {
        this._clearStorage(this._success, msg);
    }
    private _setToStorage(storage: string[], msg: string, clearAfter: boolean = true) {
        if (!msg) return false;
        storage.push(msg);
        if (clearAfter) {
            setTimeout(() => {
                this._clearStorage(storage, msg);
            }, (this._clearAfterSeconds * 1000));
        }
    }
    private _clearStorage(storage: string[], msg: string = null) {
        if (msg) {
            storage.forEach((element, index) => {
                if (element === msg) {
                    storage.splice(index, 1);
                }
            });
        } else {
            storage = [];
        }
    }
}
