import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";

@Component({
  selector: 'modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent implements OnInit {

  @Input() id!: string;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error("Modal должен иметь id");
      return;
    }

    // @ts-ignore
    this.element.addEventListener('click', x => {
      if (x.target.className === 'modal') {
        this.close();
      }
    });

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove;
  }

  open(): void {
    this.element.style.display = 'block';
  }

  close(): void {
    this.element.style.display = 'none';
  }

}
