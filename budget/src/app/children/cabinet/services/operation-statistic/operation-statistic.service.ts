import { Injectable } from '@angular/core';
import {LogService} from "../log/log.service";
import {Operation} from "../../../../models/classes/operation.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OperationStatisticService {

  private operationList: Operation[] = []
  private kek = [5, 2, 8, 10, 1]

  constructor(private logService: LogService) {
    this.logService.$operationList.subscribe(list => this.operationList = list);
    this.getSortedOperationList(true)
  }

  public getSortedOperationList(ascending: boolean): void {
    this.operationList.sort(function (a,b) {
      if (a.date > b.date) {
        return -1
      }
      if (a.date < b.date) {
        return 1
      }
      return 0
    })
  }

  private compareFunction(a: Operation, b: Operation): number {
    if (a.date > b.date) {
      return -1
    }
    if (a.date < b.date) {
      return 1
    }
    return 0
  }
}
