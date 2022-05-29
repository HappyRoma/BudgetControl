import {Component, OnInit, ViewChild} from '@angular/core';
import {LogService} from "../../services/log/log.service";
import {Operation} from "../../../../models/classes/operation.model";
import {Day} from "../../../../models/classes/day.model";
import {AppComponent} from "../../../../app.component";
import {ModalService} from "../../services/modal/modal.service";
import {AddOperationModalComponent} from "../add-operation-modal/add-operation-modal.component";
import {Category} from "../../../../models/classes/category.model";
import {Card} from "../../../../models/classes/card.model";
import {OperationFormParams} from "../../../../models/interfaces/form-params";

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  public operationList: Operation[] = [];
  private currentOperation!: Operation;
  @ViewChild(AddOperationModalComponent) child!: AddOperationModalComponent;

  constructor(private logService: LogService, private notify: AppComponent, private modalService: ModalService) {
    this.logService.$operationList.subscribe(operations => this.operationList = operations.sort(this.compareFunction))
  }

  ngOnInit(): void {
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

  getOperationDate(operation: Operation): string {
    if (operation) {
      return new Day().getDay(operation.date);
    }

    return '';
  }

  onQuestionClick() {
    this.notify.showNotification('Операции', 'Для того, чтобы изменить параметры операции или удалить ее, кликните по ней 2 раза', 'info');
  }

  onSubmit(event: OperationFormParams) {
    this.logService.updateOperation(event.category, event.card, event.date, event.value, this.currentOperation);
    this.notify.showNotification('Операция','Операция успешна изменена', 'success');
    this.modalService.close('update-operation');
  }

  onDelete(event: boolean) {
    if (event) {
      this.logService.deleteOperation(this.currentOperation);
      this.notify.showNotification('Операция', 'Операция успешна удалена', 'success');
      this.modalService.close('update-operation');
    }
  }

  openOperationUpdate(id: string, operation: Operation) {
    this.currentOperation = operation;
    this.child.setCurrentDate(operation.date);
    this.child.setCurrentValue(operation.value);
    this.child.setCurrentCard(operation.card);
    // @ts-ignore
    this.child.setCurrentCategory(operation.categoryName);

    this.modalService.open(id);
  }
}
