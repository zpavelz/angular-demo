import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tasksPipe'})

export class TasksPipe implements PipeTransform {
    transform(tasksList, statusID) {
        return (tasksList) ? tasksList.filter(tsk => (Number(tsk.Status.Id) === Number(statusID)))
            : null
            ;
    }
}
