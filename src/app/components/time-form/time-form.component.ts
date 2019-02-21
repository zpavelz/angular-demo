import { Component, Input, Output , EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-time-form',
    templateUrl: './time-form.component.html'
})

export class TimeFormComponent {
    @Input() tsID;
    @Input() tSheetKey;
    @Input() projectKey;
    @Input() taskKey;
    @Input() oldHours;
    @Input() oldComment;
    @Output() myEvent = new EventEmitter<object>();
    isFormAvailable: boolean;
    constructor(private _sData: DataService) {
        this.isFormAvailable = false;
    }
    addHoursForTask(hours, comment): any {
        this._sData.editTimeSheet(this.tsID, Number(hours.value), Number(this.taskKey), this.tSheetKey, comment.value).subscribe(r => {
            hours.value = '';
            comment.value = '';
            const eData = {
                tsID: r.Id,
                hours: r.LoggedTime,
                taskKey: this.taskKey,
                dateKey: this.tSheetKey,
                projectKey: this.projectKey,
                comment: r.Comment
            };
            this.myEvent.emit(eData);
        });
        this.isFormAvailable = false;
    }
    canAddHours() {
        const nowDate = new Date();
        const incomeDate = new Date(this.tSheetKey);
        return (nowDate >= incomeDate);
    }
    closePopup() {
        setTimeout(() => { this.isFormAvailable = false; }, 5000);
    }
}
