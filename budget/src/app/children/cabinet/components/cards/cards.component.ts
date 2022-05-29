import { Component, OnInit } from '@angular/core';
import {LogService} from "../../services/log/log.service";
import {Card} from "../../../../models/classes/card.model";
import {ModalService} from "../../services/modal/modal.service";
import {CategoryFormParams} from "../../../../models/interfaces/form-params";
import {AppComponent} from "../../../../app.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  public cardList: Card[] = [];
  public sumCardAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private modalService: ModalService, private notify: AppComponent, private service: LogService) {
    this.service.$cardList.subscribe(cardList => {
      this.cardList = cardList;
      let sum = 0;
      cardList.forEach(card => {
        sum += card.amount;
      })
      this.sumCardAmount.next(sum);
    })
  }

  ngOnInit(): void {
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onSubmit(event: CategoryFormParams) {
    try {
      this.service.addNewCard(event.name, event.colorIndex, event.iconIndex);
      this.notify.showNotification('Счет', 'Счет успешно создан', 'success');
      this.modalService.close('createCard');
    }
    catch (error) {
      this.notify.showNotification('Счет', 'Счет с таким именем уже существует', 'error');
    }
  }
}
