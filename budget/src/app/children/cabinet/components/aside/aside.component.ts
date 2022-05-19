import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LogService} from "../../services/log/log.service";
import {Day} from "../../../../models/classes/day.model";
import {Months} from "../../enums/months";
import {filter, map, Observable} from "rxjs";

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

  constructor(private logService: LogService) {
    this.logService.$username.subscribe(name => this.name = name);
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


  public difference: number = 0;

  getValue(index: number): number {
    return Number.isNaN(index) ? this.difference : this.value[index];
  }

  readonly labelsX: string[] = ['ДЕК','ЯНВ','ФЕВ','МАР'];
  readonly labelsY: string[] = ['0', '20000', '30000', '40000', '50000'];
  readonly axeValue: [number[], number[]] = [
    [25000, 32000, 35000, 32000],
    [38000, 41000, 47000, 45000]
  ];
}
