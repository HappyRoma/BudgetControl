import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { LogService } from '../../services/log/log.service';
import { Category } from '../../../../models/classes/category.model';
import { BehaviorSubject } from 'rxjs';
import { Card } from '../../../../models/classes/card.model';
import { AppComponent } from '../../../../app.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Day } from '../../../../models/classes/day.model';
import { OperationFormParams } from '../../../../models/interfaces/form-params';
import { ICard } from '../../../../models/interfaces/card.interface';


@Component({
    selector: 'add-operation-modal',
    templateUrl: './add-operation-modal.component.html',
    styleUrls: ['./add-operation-modal.component.css']
})
export class AddOperationModalComponent implements OnInit {

  @Input() modalType: 'update' | 'create' = 'create';
  @Output() submitForm = new EventEmitter<OperationFormParams>();
  @Output() deleteOperation = new EventEmitter<boolean>();

  public currentCategory: BehaviorSubject<Category> = new BehaviorSubject<Category>({
      name: 'Другое',
      color: 'grey',
      icon: '',
      type: 'expend'
  });
  public currentCard: Card = new Card('Карта отсутствует', 'grey', '');
  public categoryList: Category[] = [];
  public cardList: Card[] = [];

  public operationForm: FormGroup = new FormGroup({
      dateValue: new FormControl(new Day().getToday(), Validators.required),
      amountValue: new FormControl(0, Validators.required)
  });

  private _serviceCategoryList: Category[] = [];

  constructor(private _modalService: ModalService, private _service: LogService, private _notify: AppComponent) {
      this._service.$categoryList.subscribe((catList: Category[]) => {
          this._serviceCategoryList = catList;
      });

      this._service.$cardList.subscribe((cardList: ICard[]) => {
          this.cardList = cardList;
          if (this.cardList[0]) {
              this.currentCard = this.cardList[0];
          }
      });

      this.currentCategory.asObservable().subscribe((category: Category) => {
          if (category.name !== 'Другое') {
              this.categoryList = [];
              this._serviceCategoryList.forEach((cat: Category) => {
                  if (cat.type === this.currentCategory.getValue().type) {
                      this.categoryList.push(cat);
                  }
              });
          }
          else {
              this.categoryList = this._serviceCategoryList;
          }
      });
  }

  public ngOnInit(): void {
  }

  public onSubmit(): void {
      if (this.operationForm.invalid || this.operationForm.value.amountValue === 0) {
          if (this.operationForm.get('dateValue')?.getError('required')) {
              this._notify.showNotification('Дата','Это обязательное поле','error');
          }
          if (this.operationForm.get('amountValue')?.getError('required')) {
              this._notify.showNotification('Сумма','Это обязательное поле','error');
          }
          if (this.operationForm.value.amountValue === 0) {
              this._notify.showNotification('Сумма','Введите сумму, отличную от нуля', 'error');
          }

          Object.keys(this.operationForm.controls).forEach((controlName: string) => this.operationForm.controls[controlName].markAsTouched());

          return;
      }
      if (this.currentCard.name === 'Карта отсутствует') {
          this._notify.showNotification('Счет не выбран', 'Для добавления операции нужно указать счет.Если у вас нет счетов, перейдите во вкладку Cards для создания счета', 'error');

          return;
      }
      if (this.currentCategory.getValue().type === 'expend') {
          this.submitForm.emit({
              category: this.currentCategory.getValue(),
              card: this.currentCard,
              date: this.operationForm.value.dateValue,
              value: this.operationForm.value.amountValue * -1
          });
      }
      else {
          this.submitForm.emit({
              category: this.currentCategory.getValue(),
              card: this.currentCard,
              date: this.operationForm.value.dateValue,
              value: this.operationForm.value.amountValue
          });
      }
  }

  public onDelete(): void {
      this.deleteOperation.emit(true);
  }

  public openModal(id: string): void {
      if (id === 'chooseCategory') {
          if (this.categoryList.length === 0) {
              this._notify.showNotification('Категории не найдены', 'Для добавления операции нужна хотя бы одна категория. Перейдите во вкладку Categories для создания категории', 'error');
          }
          else {
              this._modalService.open(id);
          }
      }
      if (id === 'chooseCard') {
          if (this.cardList.length === 0) {
              this._notify.showNotification('Счета не найдены', 'Для добавления операции нужен хотя бы один счет. Перейдите во вкладку Cards для создания счета', 'error');
          }
          else {
              this._modalService.open(id);
          }
      }
  }

  public setCurrentDate(date: string): void {
      this.operationForm.controls['dateValue'].setValue(date);
  }

  public setCurrentValue(value: number): void {
      this.operationForm.controls['amountValue'].setValue(Math.abs(value));
  }

  public setCurrentCategory(category: Category | string): void {
      if (typeof category === 'string') {
          this.currentCategory.next(this._serviceCategoryList.find((cat: Category) => cat.name === category) ?? this.currentCategory.getValue());
      }
      else {
          this.currentCategory.next(category);
      }
      this._modalService.close('chooseCategory');
  }

  public setCurrentCard(card: Card | string): void {
      if (typeof card === 'string') {
          this.currentCard = this.cardList.find((c: Card) => c.name === card) ?? this.currentCard;
      }
      else {
          this.currentCard = card;
      }
      this._modalService.close('chooseCard');
  }
}
