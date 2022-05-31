import { Component, OnInit, ViewChild } from '@angular/core';
import { LogService } from '../../services/log/log.service';
import { Operation } from '../../../../models/classes/operation.model';
import { Day } from '../../../../models/classes/day.model';
import { AppComponent } from '../../../../app.component';
import { ModalService } from '../../services/modal/modal.service';
import { AddOperationModalComponent } from '../add-operation-modal/add-operation-modal.component';
import { OperationFormParams } from '../../../../models/interfaces/form-params';
import { map, Observable } from 'rxjs';

@Component({
    selector: 'app-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.css']
})
export class OperationsComponent {

    @ViewChild (AddOperationModalComponent) child!: AddOperationModalComponent;

    private _currentOperation!: Operation;


    constructor(private _logService: LogService, private _notify: AppComponent, private _modalService: ModalService) {
        console.log(new Date().getDay());
    }

    public get operationList$(): Observable<Operation[]> {
        return this._logService.$operationList.pipe(
            map((operations: Operation[]) => {
                return operations.sort(this.compareFunction);
            })
        );
    }

    public getOperationDate(operation: Operation): string {
        if (operation) {
            return new Day().getDay(operation.date);
        }

        return '';
    }

    public onQuestionClick(): void {
        this._notify.showNotification('Операции', 'Для того, чтобы изменить параметры операции или удалить ее, кликните по ней 2 раза', 'info');
    }

    public onSubmit(event: OperationFormParams): void {
        this._logService.updateOperation(event.category, event.card, event.date, event.value, this._currentOperation);
        this._notify.showNotification('Операция','Операция успешна изменена', 'success');
        this._modalService.close('update-operation');
    }

    public onDelete(event: boolean): void {
        if (event) {
            this._logService.deleteOperation(this._currentOperation);
            this._notify.showNotification('Операция', 'Операция успешна удалена', 'success');
            this._modalService.close('update-operation');
        }
    }

    public openOperationUpdate(id: string, operation: Operation): void {
        this._currentOperation = operation;
        this.child.setCurrentDate(operation.date);
        this.child.setCurrentValue(operation.value);
        this.child.setCurrentCard(operation.card);
        this.child.setCurrentCategory(operation.categoryName);

        this._modalService.open(id);
    }

    private compareFunction(a: Operation, b: Operation): number {
        if (a.date > b.date) {
            return -1;
        }
        if (a.date < b.date) {
            return 1;
        }

        return 0;
    }
}
