import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent implements OnInit, OnDestroy {

  @Input() id!: string;
  private _element: any;

  constructor(private _modalService: ModalService, private _el: ElementRef) {
      this._element = this._el.nativeElement;
  }

  public ngOnInit(): void {
      if (!this.id) {
          console.error('Modal должен иметь id');

          return;
      }

      // @ts-ignore
      this._element.addEventListener('click', x => {
          if (x.target.className === 'my-modal') {
              this.close();
          }
      });

      this._modalService.add(this);
  }

  public ngOnDestroy(): void {
      this._modalService.remove(this.id);
      this._element.remove;
  }

  public open(): void {
      this._element.style.display = 'block';
  }

  public close(): void {
      this._element.style.display = 'none';
  }

}
