import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log/log.service';
import { Card } from '../../../../models/classes/card.model';
import { ModalService } from '../../services/modal/modal.service';
import { CategoryFormParams } from '../../../../models/interfaces/form-params';
import { AppComponent } from '../../../../app.component';
import { BehaviorSubject } from 'rxjs';
import { ICard } from '../../../../models/interfaces/card.interface';

@Component({
    selector: 'cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

    public cardList: Card[] = [];
    public sumCardAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(private _modalService: ModalService, private _notify: AppComponent, private _service: LogService) {
        this._service.$cardList.subscribe((cardList: ICard[]) => {
            this.cardList = cardList;
            let sum: number = 0;
            cardList.forEach((card: ICard) => {
                sum += card.amount;
            });
            this.sumCardAmount.next(sum);
        });
    }

    public ngOnInit(): void {
    }

    public openModal(id: string): void {
        this._modalService.open(id);
    }

    public onSubmit(event: CategoryFormParams): void {
        try {
            this._service.addNewCard(event.name, event.colorIndex, event.iconIndex);
            this._notify.showNotification('Счет', 'Счет успешно создан', 'success');
            this._modalService.close('createCard');
        }
        catch (error) {
            this._notify.showNotification('Счет', 'Счет с таким именем уже существует', 'error');
        }
    }
}
