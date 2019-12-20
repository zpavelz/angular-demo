import { Injectable     } from '@angular/core';
import { HttpClient     } from '@angular/common/http';
import { HttpHeaders    } from '@angular/common/http';
import { map            } from 'rxjs/operators';
import { apiConfig      } from '../../environments/environment';
import { ApiPaths       } from '../constants/api-paths.constants';

import { MsgService } from './msg.service';
import { Observable } from 'rxjs/index';
import { InfTask    } from '../interfaces/task.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private static _key             = apiConfig.key;
    private static _url             = apiConfig.url;
    constructor(private http: HttpClient, private _sMsg: MsgService) {
    }
    private static _getHeaders() {
        return new HttpHeaders().set('API_KEY', ApiService._key);
    }
    private _get(path, additionalPath = '') {
        const headers = ApiService._getHeaders();
        return this.http.get(ApiService._url + path + additionalPath
            , {headers})
            .pipe(map((response: any) => response));
    }
    private _put(data, path, additionalPath = '') {
        const headers = ApiService._getHeaders();
        return this.http.put(
            ApiService._url + path + additionalPath,
            data
            , {headers}
        ).pipe(map((response: any) => response));
    }
    private _post(data, path, additionalPath = '') {
        const headers = ApiService._getHeaders();
        return this.http.post(
            ApiService._url + path + additionalPath,
            data
            , {headers}
        ).pipe(map((response: any) => response));
    }
    private _delete(path, additionalPath = '') {
        const headers = ApiService._getHeaders();
        return this.http.delete(
            ApiService._url + path + additionalPath
            , {headers}
        ).pipe(map((response: any) => response));
    }
    tryToLogin(login: string, password: string): any {
        if (!login || !password) {
            return this._sMsg.setError('Wrong credentials data');
        }
        const data = {
            'Login': login,
            'Password': password,
        };
        return this._post(data, ApiPaths.EMPLOYEES, '/login');
    }
    getProjects() {
        return this._get(ApiPaths.PROJECTS);
    }
    getProject(prjID) {
        return this._get(ApiPaths.PROJECTS, '/' + prjID);
    }
    getSearchTimeSheetsByProjectID(prjID) {
        return this._get(ApiPaths.TIMESHEETS, '/search?query.projId=' + prjID);
    }
    getSearchTasksByProjectID(prjID): Observable<any> {
        return this._get(ApiPaths.TASKS, '/search?taskSearch.projectId=' + prjID);
    }
    /**
     * Add or Update time sheet
     * */
    putTimeSheet(tsID: number, hours: number, taskID: number, date: string = null, comment: string = null): any {
        if (tsID < 0) {
            return this._sMsg.setError('TimeSheet ID must not be negative');
        }
        if (hours <= 0) {
            return this._sMsg.setError('Hours should be greater then zero');
        }
        const data = {
            'LoggedTime': hours,
            'Date': (new Date(date).toISOString()),
            'TicketId': taskID,
            'Comment': comment,
            'Id': tsID
        };
        return (tsID > 0) ? this._put(data, ApiPaths.TIMESHEETS) : this._post(data, ApiPaths.TIMESHEETS);
    }
    /**
     * Add or Update task
     * */
    putTask(data: InfTask): any {
        if (!data || data === undefined) {
            return this._sMsg.setError('Empty data');
        }
        if (!data.Name || data.Name === '' || data.Name === undefined) {
            return this._sMsg.setError('Task Name is empty');
        }
        if (!data.ProjectId || data.ProjectId === undefined || data.ProjectId <= 0) {
            return this._sMsg.setError('Wrong Project ID');
        }
        return (Number(data.Id) > 0) ? this._put(data, ApiPaths.TASKS) : this._post(data, ApiPaths.TASKS);
    }
    /**
     * Delete Task
     * */
    deleteTask(taskID): any {
        if (taskID <= 0) {
            return this._sMsg.setError('Wrong task ID');
        }
        return this._delete(ApiPaths.TASKS, '/' + taskID);
    }
}
