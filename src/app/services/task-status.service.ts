import { Injectable } from '@angular/core';
import { TaskStatuses } from '../constants/task-statuses.constants';

@Injectable({
    providedIn: 'root'
})
export class TaskStatusService {
    static getNameByID(statusID): string {
        switch (statusID) {
            case TaskStatuses.SID_OPEN:
                return 'Open';
                break;
            case TaskStatuses.SID_DEVELOPMENT:
                return 'Development';
                break;
            case TaskStatuses.SID_FOR_QA:
                return 'Ready for QA';
                break;
            case TaskStatuses.SID_TEST:
                return 'Test';
                break;
            case TaskStatuses.SID_CLOSED:
                return 'Closed';
                break;
        }
        return null;
    }
    static getList() {
        const list = [];
        list[TaskStatuses.SID_OPEN]        = TaskStatusService.getNameByID(TaskStatuses.SID_OPEN);
        list[TaskStatuses.SID_DEVELOPMENT] = TaskStatusService.getNameByID(TaskStatuses.SID_DEVELOPMENT);
        list[TaskStatuses.SID_FOR_QA]      = TaskStatusService.getNameByID(TaskStatuses.SID_FOR_QA);
        list[TaskStatuses.SID_TEST]        = TaskStatusService.getNameByID(TaskStatuses.SID_TEST);
        list[TaskStatuses.SID_CLOSED]      = TaskStatusService.getNameByID(TaskStatuses.SID_CLOSED);
        return list;
    }
    static getOpenID(): number {
        return TaskStatuses.SID_OPEN;
    }
}
