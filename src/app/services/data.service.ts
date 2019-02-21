import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';

import { InfProject } from '../interfaces/project.interface';

@Injectable({
    providedIn: 'root'
})
/**
 * Data handler of API responses
 * */
export class DataService {
    projectObj: InfProject;
    constructor(private _sApi: ApiService, private _sMsg: MsgService) {
    }
    static calculateHoursSum(projectData) {
        if (projectData === undefined) {
            return null;
        }
        const pdKeys = Object.keys(projectData);
        let sum = 0;
        for (const pdk of pdKeys) {
            sum += projectData[pdk].loggedTime;
        }
        return sum;
    }
    static convertDateToKey(date): string {
        const newDate = new Date(date);
        return newDate.getFullYear() + '-' +
            '' + (((Number(newDate.getMonth()) + 1) < 10) ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + '' +
            '-' +
            '' + ((Number(newDate.getDate()) < 10) ? '0' + newDate.getDate() : newDate.getDate())
            ;
    }
    /**
     * Get project data by ID
     * */
    getProjectByID(prjID) {
        this._sApi.getProject(prjID).subscribe(project => {
            this.projectObj = project;
        });
    }
    /**
     * Get tasks just for one project
     * */
    getTasksForOneProjectByID(prjID) {
        return this._sApi.getSearchTasksByProjectID(prjID);
    }
    getProjectsAPI() {
        return this._sApi.getProjects();
    }
    getTimeSheetsAPI(prjID: number) {
        return this._sApi.getSearchTimeSheetsByProjectID(prjID);
    }
    getTasksAPI(prjID: number) {
        return this._sApi.getSearchTasksByProjectID(prjID);
    }
    /**
     * Changing or adding time-sheets to specific task
     * */
    editTimeSheet(tsID: number, hours: number, taskID: number, date: string, comment: string = null) {
        return this._checkEventAPI(this._sApi.putTimeSheet(tsID, hours, taskID, date, comment), 'Time-sheets was added');
    }
    /**
     * Changing or adding task
     * */
    editTask(data, msgSuccess: string = null) {
        return this._checkEventAPI(this._sApi.putTask(data), msgSuccess);
    }
    /**
     * Delete Task
     * */
    deleteTaskByID(taskID) {
        return this._checkEventAPI(this._sApi.deleteTask(taskID));
    }
    /**
     * Create new task
     * */
    createTask(data) {
        this._sMsg.clearAll();
        if (
            !data.Name
            || !data.Description
            || !data.StartDate
            || !data.EndDate
        ) {
            return this._sMsg.setError('Please fill all fields');
        }
        if (data.Name.length <= 3) {
            return this._sMsg.setError('Name should have more than 3 symbols');
        }
        if (data.Description.length <= 10) {
            return this._sMsg.setError('Name should have more than 10 symbols');
        }
        data.StartDate = new Date(data.StartDate).toISOString();
        data.EndDate = new Date(data.EndDate).toISOString();
        return this._checkEventAPI(this._sApi.putTask(data), 'Task was ' + (data.Id > 0 ? 'edited' : 'added'));
    }
    private _checkEventAPI(apiResult, msgSuccess: string = null) {
        if (!this._sMsg.hasErrors()) {
            if (msgSuccess) this._sMsg.setSuccess(msgSuccess);
            return apiResult;
        }
        return false;
    }
}
