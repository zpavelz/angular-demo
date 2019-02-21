import { Component, Input, Output , EventEmitter } from '@angular/core';
import { DataService    } from '../../services/data.service';
import { MsgService     } from '../../services/msg.service';

@Component({
    selector: 'app-task-form',
    templateUrl: './task-form.component.html'
})

export class TaskFormComponent {
    @Input() isNew;
    @Input() taskData;
    @Output() myEvent = new EventEmitter<object>();
    isFormAvailable:    boolean;
    constructor(private _sData: DataService, private _sMsg: MsgService) {
        this.isFormAvailable = false;
    }
    editTask() {
        const res = this._sData.createTask(this.taskData);
        if (!res) return false;
        this.isFormAvailable = false;
        res.subscribe(
            r => {
                this.myEvent.emit(r);
            },
            err => this._sMsg.setError(err.error.Message)
        );
    }
}
