import { Component      } from '@angular/core';
import { DataService    } from '../../services/data.service';
import { MsgService     } from '../../services/msg.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})

export class HomeComponent {
    processedProjectIDs:    number[];
    projectsDataTemp:       object[];
    projectsData:           object[];
    timeSheetsTemp:         object[][][];
    timeSheets:             object[][][];
    tsCommentsTemp:         string[][][];
    tsComments:             string[][][];
    tasksDataTemp:          object[];
    tasksData:              object[];
    datesPeriodList:        string[];
    private _generationInProgress: boolean;
    constructor(private _sData: DataService, private _sMsg: MsgService) {
        this._generationInProgress = false;
        this.processedProjectIDs    = [];
        this.datesPeriodList        = [];
        this.generateDatesPeriodList(null, -1);
        this.getProjectsDataAPI();
    }
    getProjectsDataAPI() {
        this.projectsDataTemp       = [];
        this.projectsData           = [];
        this.timeSheets             = [];
        this.timeSheetsTemp         = [];
        this.tsComments             = [];
        this.tsCommentsTemp         = [];
        this.tasksData              = [];
        this.tasksDataTemp          = [];
        this._sData.getProjectsAPI().subscribe(data => {
            const prjKeys = Object.keys(data);
            for (const pk of prjKeys) {
                const prjID = data[pk].Id;
                this.projectsDataTemp[prjID] = data[pk];
                this.processedProjectIDs[prjID] = prjID;
            }
            this.getTimeSheetsData();
        });
    }
    getTimeSheetsData() {
        this.processedProjectIDs.forEach((prjID, index) => {
            this._sData.getTimeSheetsAPI(prjID).subscribe(data => {
                let timeSheetsKeys = Object.keys(data);
                for (const tsk of timeSheetsKeys) {
                    const dateValue = DataService.convertDateToKey(data[tsk].Date);
                    if (this.timeSheetsTemp[dateValue] === undefined) {
                        this.timeSheetsTemp[dateValue] = [];
                    }
                    if (this.timeSheetsTemp[dateValue][prjID] === undefined) {
                        this.timeSheetsTemp[dateValue][prjID] = [];
                    }
                    this.timeSheetsTemp[dateValue][prjID][data[tsk].TicketId] = {ID: data[tsk].Id, loggedTime: data[tsk].LoggedTime};
                    if (data[tsk].Comment) {
                        if (this.tsCommentsTemp[dateValue] === undefined) this.tsCommentsTemp[dateValue] = [];
                        if (this.tsCommentsTemp[dateValue][prjID] === undefined) this.tsCommentsTemp[dateValue][prjID] = [];
                        this.tsCommentsTemp[dateValue][prjID][data[tsk].TicketId] = data[tsk].Comment;
                    }
                }
                if ((Number(index) + 1) === Number(this.processedProjectIDs.length)) {
                    this.getTasksData();
                }
            },
                err => this._sMsg.setError(err.error.Message)
            );
        });
    }
    getTasksData() {
        this.processedProjectIDs.forEach((prjID, index) => {
            return this._sData.getTasksAPI(prjID).subscribe(data => {
                const tasksKeys = Object.keys(data);
                this.projectsDataTemp[prjID]['tasksIDs'] = [];
                for (const tk of tasksKeys) {
                    this.projectsDataTemp[prjID]['tasksIDs'][data[tk].Id] = data[tk].Id;
                    this.tasksDataTemp[data[tk].Id] = data[tk];
                }
                if ((Number(index) + 1) === Number(this.processedProjectIDs.length)) {
                    this.tsComments = this.tsCommentsTemp;
                    this.timeSheets = this.timeSheetsTemp;
                    this.tasksData = this.tasksDataTemp;
                    this.projectsData = this.projectsDataTemp;
                    setTimeout(() => {
                        this.tsCommentsTemp = [];
                        this.timeSheetsTemp = [];
                        this.tasksDataTemp = [];
                        this.projectsDataTemp = [];
                    }, 3000);
                }
            },
                err => this._sMsg.setError(err.error.Message)
            );
        });
    }
    isProjectsDataLoaded() {
        return this.projectsData.length > 0;
    }
    getHoursSum(dateKey, projectID) {
        return (this.timeSheets[dateKey])
            ? DataService.calculateHoursSum(this.timeSheets[dateKey][projectID])
            : 0
        ;
    }
    convertDateKey(date) {
        const newDate = new Date(date);
        return ((Number(newDate.getDate()) < 10) ? '0' + newDate.getDate() : newDate.getDate()) + '' +
            '/' +
            '' + (((Number(newDate.getMonth()) + 1) < 10) ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + '' +
            '/' +
            '' + newDate.getFullYear()
            ;
    }
    generateDatesPeriodList(oldDate: string = null, direction: number = null) {
        const nowDate = new Date();
        const incomeDate = new Date(oldDate);
        if (nowDate < incomeDate) return false;
        // to avoid double clicks
        if (this._generationInProgress) return false;
        this._generationInProgress = true;
        const dateObj = (oldDate) ? new Date(oldDate) : new Date();
        let list = [];
        direction = (direction === -1) ? direction : 1;
        let step = 0;
        for (let i = 0; i < 5; i++) {
            step = (i === 0) ? 0 : direction;
            dateObj.setDate(dateObj.getDate() + step);
            list.push(DataService.convertDateToKey(dateObj.toString()));
        }
        if (direction === -1) list = list.reverse();
        this.datesPeriodList = list;
        this._generationInProgress = false;
    }
    makeDateStepLeft() {
        this.generateDatesPeriodList(this.datesPeriodList[0], -1);
    }
    makeDateStepRight() {
        this.generateDatesPeriodList(this.datesPeriodList[(this.datesPeriodList.length - 1)]);
    }
    updateTableData(data) {
        if (this.timeSheets[data.dateKey] === undefined)
            this.timeSheets[data.dateKey] = [];
        if (this.timeSheets[data.dateKey][data.projectKey] === undefined)
            this.timeSheets[data.dateKey][data.projectKey] = [];
        this.timeSheets[data.dateKey][data.projectKey][data.taskKey] = {ID: data.tsID, loggedTime: Number(data.hours)};
        if (data.comment) {
            if (this.tsComments[data.dateKey] === undefined)
                this.tsComments[data.dateKey] = [];
            if (this.tsComments[data.dateKey][data.projectKey] === undefined)
                this.tsComments[data.dateKey][data.projectKey] = [];
            this.tsComments[data.dateKey][data.projectKey][data.taskKey] = data.comment;
        }
    }
}
