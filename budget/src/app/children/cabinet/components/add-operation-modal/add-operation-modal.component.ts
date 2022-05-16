import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {LogService} from "../../services/log/log.service";
import {Category} from "../../../../models/classes/category.model";
import {BehaviorSubject} from "rxjs";
import {Card} from "../../../../models/classes/card.model";
import {AppComponent} from "../../../../app.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Day} from "../../../../models/classes/day.model";


@Component({
  selector: 'add-operation',
  templateUrl: './add-operation-modal.component.html',
  styleUrls: ['./add-operation-modal.component.css']
})
export class AddOperationModalComponent implements OnInit {

  public currentCategory: BehaviorSubject<Category> = new BehaviorSubject<Category>({
    name: 'Другое',
    color: 'grey',
    icon: '',
    type: 'expend'
  });
  public currentCard: Card = new Card('Карта отсутствует', 'grey', '');
  private serviceCategoryList: Category[] = [];
  public categoryList: Category[] = [];
  public cardList: Card[] = [];

  constructor(private modalService: ModalService, private service: LogService, private notify: AppComponent) {
    this.service.$categoryList.subscribe(catList => {
      this.serviceCategoryList = catList;
    });

    this.service.$cardList.subscribe(cardList => {
      this.cardList = cardList;
      if (this.cardList[0]) {
        this.currentCard = this.cardList[0];
      }
    })

    this.currentCategory.asObservable().subscribe(category => {
      if (category.name !== 'Другое') {
        this.categoryList = [];
        this.serviceCategoryList.forEach(category => {
          if (category.type === this.currentCategory.getValue().type) {
            this.categoryList.push(category)
          }
        })
      }
      else {
        this.categoryList = this.serviceCategoryList;
      }
    })
  }

  ngOnInit(): void {
  }

  public operationForm = new FormGroup({
    dateValue: new FormControl(new Day().getToday(), Validators.required),
    amountValue: new FormControl(0, Validators.required)
  })

  onSubmit() {
    const controls = this.operationForm.controls;

    if (this.operationForm.invalid || this.operationForm.value.amountValue === 0) {
      if (this.operationForm.get('dateValue')?.getError('required')) {
        this.notify.showNotification('Дата','Это обязательное поле','error');
      }
      if (this.operationForm.get('amountValue')?.getError('required')) {
        this.notify.showNotification('Сумма','Это обязательное поле','error');
      }
      if (this.operationForm.value.amountValue === 0) {
        this.notify.showNotification('Сумма','Введите сумму, отличную от нуля', 'error');
      }

      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    if (this.currentCard.name === 'Карта отсутствует') {
      this.notify.showNotification('Счет не выбран', 'Для добавления операции нужно указать счет.Если у вас нет счетов, перейдите во вкладку Cards для создания счета', 'error');

      return;
    }
    this.service.addOperation(this.currentCategory.getValue(), this.currentCard, this.operationForm.value.dateValue, this.operationForm.value.amountValue);
    this.modalService.close('createOperation');
    this.notify.showNotification('Операция','Операция успешна добавлена', 'success');
  }

  openModal(id: string) {
    if (id === "chooseCategory") {
      if (this.categoryList.length === 0) {
        this.notify.showNotification('Категории не найдены', 'Для добавления операции нужна хотя бы одна категория. Перейдите во вкладку Categories для создания категории', 'error');
      }
      else {
        this.modalService.open(id);
      }
    }
    if (id === 'chooseCard') {
      if (this.cardList.length === 0) {
        this.notify.showNotification('Счета не найдены', 'Для добавления операции нужен хотя бы один счет. Перейдите во вкладку Cards для создания счета', 'error');
      }
      else {
        this.modalService.open(id);
      }
    }
  }

  setCurrentCategory(category: Category) {
    this.currentCategory.next(category);
    this.modalService.close('chooseCategory');
  }

  setCurrentCard(card: Card) {
    this.currentCard = card;
    this.modalService.close('chooseCard');
  }
}
