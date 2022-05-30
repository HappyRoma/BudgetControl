import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log/log.service';
import { Day } from '../../../../models/classes/day.model';
import { Months } from '../../enums/months';
import { filter, map, Observable } from 'rxjs';
import { Operation } from '../../../../models/classes/operation.model';
import { Category } from '../../../../models/classes/category.model';
import { authState, getAuth, User } from '@angular/fire/auth';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.css', 'aside.component.less']
})
export class AsideComponent implements OnInit {

    public name: string = '';
    public currentMonth: string = `${Months[parseInt(new Day().getTodayDate('month'))]} ${new Day().getTodayDate('year')}`;
    public value!: number[];
    public dividedOperationLists: Operation[][] = [];
    public difference: number = 0;
    public $user: Observable<User | null>  = authState(getAuth());
    private _income: number = 0;
    private _expend: number = 0;

    private _operations: Operation[] = [];
    private _categoryList: Category[] = [];


    constructor(private _logService: LogService) {
        this._logService.$username.subscribe((name: string) => this.name = name);
        this._logService.$operationList.subscribe((operationList: Operation[]) => this.getLastOperations(operationList));
        this._logService.$categoryList.subscribe((categoryList: Category[]) => this._categoryList = categoryList);
    }

    public get value$(): Observable<readonly number[]> {
        return  this._logService.$operationList.pipe(
            filter((q: Operation[]) => !!q.length),
            map((operationList: Operation[]) => {
                this._expend = 0;
                this._income = 0;
                this.value = [0, 0];
                operationList.forEach((operation: Operation) => {
                    if (new Day().getDate(operation.date, 'month') === new Day().getTodayDate('month')
            && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
                        if (operation.value < 0) {
                            this._expend -= operation.value;
                        } else {
                            this._income += operation.value;
                        }
                    }
                });

                this.value = [this._income, this._expend];
                this.difference = this.value[0] - this.value[1];

                return this.value;
            })
        );
    }

    public ngOnInit(): void {
    }

    public getOperationDate(operation: Operation): string {
        if (operation) {
            return new Day().getDay(operation.date);
        }

        return '';
    }

    public getValue(index: number): number {
        return Number.isNaN(index) ? this.difference : this.value[index];
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

    private getLastOperations(operationList: Operation[]): void {
        this._operations = operationList.sort(this.compareFunction).slice(0, 4);
        this.dividedOperationLists = [];
        let divideOpList: Operation[] = [];

        this._operations.forEach((operation: Operation, index: number) => {
            if (index === 0) {
                divideOpList.push(operation);

                return;
            }
            if (divideOpList[0].date === operation.date) {
                divideOpList.push(operation);
            }
            else {
                this.dividedOperationLists.push(divideOpList);
                divideOpList = [];
                divideOpList.push(operation);
            }
        });
        this.dividedOperationLists.push(divideOpList);
    }
}
