import { Injectable } from '@angular/core';
import { LogService } from '../log/log.service';
import { Operation } from '../../../../models/classes/operation.model';

@Injectable({
    providedIn: 'root'
})
export class OperationStatisticService {

    //В разработке (Сервис на данный момент нигде не используется).

    private _operationList: Operation[] = [];
    private _kek: number[] = [5, 2, 8, 10, 1];

    constructor(private _logService: LogService) {
        this._logService.$operationList.subscribe((list: Operation[]) => this._operationList = list);
        this.getSortedOperationList(true);
    }

    public getSortedOperationList(ascending: boolean): void {
        this._operationList.sort(function (a: Operation, b: Operation) {
            if (a.date > b.date) {
                return -1;
            }
            if (a.date < b.date) {
                return 1;
            }

            return 0;
        });
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
