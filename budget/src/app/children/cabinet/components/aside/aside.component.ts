import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {LogService} from "../../services/log/log.service";
import {Day} from "../../../../models/classes/day.model";
import {Months} from "../../enums/months";
import {filter, map, Observable} from "rxjs";
import {Operation} from "../../../../models/classes/operation.model";
import {Category} from "../../../../models/classes/category.model";
import {authState, getAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css', 'aside.component.less']
})
export class AsideComponent implements OnInit {

  name: string = "";
  public currentMonth = `${Months[parseInt(new Day().getTodayDate('month'))]} ${new Day().getTodayDate('year')}`
  private income: number = 0;
  private expend: number = 0;
  public value!: number[];
  private operations: Operation[] = [];
  private categoryList: Category[] = [];
  public dividedOperationLists: Array<Array<Operation>> = [];

  constructor(private logService: LogService) {
    this.logService.$username.subscribe(name => this.name = name);
    this.logService.$operationList.subscribe(operationList => this.getLastOperations(operationList));
    this.logService.$categoryList.subscribe(categoryList => this.categoryList = categoryList);
  }

  public get value$(): Observable<readonly number[]> {
    return  this.logService.$operationList.pipe(
      filter((q) => !!q.length),
      map((operationList) => {
        this.expend = 0;
        this.income = 0;
        this.value = [0, 0];
        operationList.forEach(operation => {
          if (new Day().getDate(operation.date, "month") === new Day().getTodayDate('month')
            && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
            if (operation.value < 0) {
              this.expend -= operation.value;
            } else {
              this.income += operation.value
            }
          }
        })

        this.value = [this.income, this.expend];
        this.difference = this.value[0] - this.value[1];
        return this.value;
      })
    )
  }

  ngOnInit(): void {
  }

  public $user = authState(getAuth());

  getLastOperations(operationList: Operation[]): void {
    this.operations = operationList.sort(this.compareFunction).slice(0, 5);
    this.dividedOperationLists = [];
    let divideOpList: Operation[] = [];

    this.operations.forEach((operation, index) => {
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
    })
    this.dividedOperationLists.push(divideOpList);
  }

  getCategoryByName(categoryName: string | null): Category {
    // @ts-ignore
    return this.categoryList.find(category => category.name === categoryName);
  }

  getOperationDate(operation: Operation): string {
    if (operation) {
      return new Day().getDay(operation.date);
    }

    return '';
  }

  compareFunction(a: Operation, b: Operation): number {
    if (a.date > b.date) {
      return -1
    }
    if (a.date < b.date) {
      return 1
    }
    return 0
  }

  public difference: number = 0;

  getValue(index: number): number {
    return Number.isNaN(index) ? this.difference : this.value[index];
  }
}
