import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute     } from '@angular/router';

import { DataService        } from '../../services/data.service';
import { TaskStatusService  } from '../../services/task-status.service';
import { MsgService         } from '../../services/msg.service';

import { InfTask } from '../../interfaces/task.interface';

import { DragulaService } from 'ng2-dragula';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [DragulaService]
})

export class DashboardComponent implements OnInit {
    tasksList: InfTask[];
    private _tempTask: InfTask;
    private _projectID: number;
    constructor(
        private _route: ActivatedRoute,
        private _sMsg: MsgService,
        private _sData: DataService,
        private dragula: DragulaService
    ) {
        this._projectID = Number(this._route.snapshot.paramMap.get('id'));
        this.getTasksByProjectID(this.projectID);
    }
    ngOnInit() {
        this._sData.getProjectByID(this._projectID);
        this.dragula
            .drop()
            .subscribe(value => {
                const statusID = Number(value.target.getAttribute('data-status-key'));
                const taskID = Number(value.el.getAttribute('data-task-id'));
                this.moveTask(taskID, statusID);
            });
    }
    getTaskList(): InfTask[] {
        return this.tasksList;
    }
    /**
     * Get tasks just for one project
     * */
    getTasksByProjectID(prjID) {
        this._sData.getTasksForOneProjectByID(prjID).subscribe(data => {
            this.tasksList = data;
            this._tempTask = this.getClearTask(data[Object.keys(data)[0]]);
        });
    }
    getTaskByID(taskID: number): InfTask {
        const tasksKeys = Object.keys(this.tasksList);
        for (const tskK of tasksKeys) {
            if (this.tasksList[tskK].Id === taskID) {
                return this.tasksList[tskK];
            }
        }
    }
    removeTaskFromListByID(taskID: number) {
        return (this.tasksList)
            ? this.tasksList.filter(task => (Number(task.Id) !== taskID))
            : null
            ;
    }
    get projectID(): number {
        return this._projectID;
    }
    get projectName() {
        return (this._sData.projectObj && this._sData.projectObj !== undefined) ? this._sData.projectObj.Name : '';
    }
    moveTask(taskID: number, statusID: number) {
        const task = this.getTaskByID(taskID);
        task.StatusId = statusID;
        this._sData.editTask(task, null
        ).subscribe(r => {
            this._sMsg.setSuccess('Task "' + task.Name + '" moved to "' + TaskStatusService.getNameByID(statusID) + '"');
        });
    }
    updateTasksData(data: InfTask) {
        const tsKeys = Object.keys(this.tasksList);
        let isNew = true;
        for (const tsk of tsKeys) {
            if (Number(data.Id) === Number(this.tasksList[tsk].Id)) {
                isNew = false;
                this.tasksList[tsk] = data;
            }
        }
        if (isNew) {
            this.tasksList.push(data);
        }
        this.tasksList = this.tasksList.filter(task => task);
    }
    deleteTask(taskID: number, taskName: string) {
        if (!confirm('Are you sure to delete task ' + taskName + '?')) return false;
        this._sData.deleteTaskByID(taskID).subscribe(r => {
            this._sMsg.setSuccess('Task ' + taskName + ' deleted successfully');
            this.tasksList = this.removeTaskFromListByID(taskID);
        });
    }
    getTaskStatuses() {
        return TaskStatusService.getList();
    }
    getClearTask(taskObj: InfTask): InfTask {
        taskObj.ProjectId     = this.projectID;
        taskObj.Name          = '';
        taskObj.Description   = '';
        taskObj.StartDate     = null;
        taskObj.EndDate       = null;
        taskObj.StatusId      = TaskStatusService.getOpenID();
        taskObj.Id            = 0;
        return taskObj;
    }
    get tempTask() {
        return this._tempTask;
    }
}
