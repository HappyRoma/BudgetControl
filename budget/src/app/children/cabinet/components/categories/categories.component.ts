import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {AppComponent} from "../../../../app.component";
import {LogService} from "../../services/log/log.service";
import {ICategory} from "../../../../models/interfaces/category.interface";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {FormParams} from "../../../../models/interfaces/form-params";
import {Category} from "../../../../models/classes/category.model";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./styles/categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public iscategoryMoving: boolean = false;

  constructor(private modalService: ModalService, private notify: AppComponent, private service: LogService) {
    this.service.$categoryList.subscribe(catList => {
      this.categoryList = catList;
    })
  }

  ngOnInit(): void {
  }

  public categoryList: Category[] = [];

  openModal(id: string) {
    this.modalService.open(id);
  }

  onSubmit(event: FormParams) {
    try {
      this.service.addNewCategory(event.name, event.colorIndex, event.iconIndex);
      this.notify.showNotification('Категория', 'Категория успешно создана', 'success');
      this.modalService.close('createCategory');
    }
    catch (error) {
      this.notify.showNotification('Категория', 'Категория с таким именем уже существует', 'error');
    }
  }

  showBinInfo() {
    this.notify.showNotification('Удаление категории', 'Перенесите сюда категорию, чтобы удалить ее.', 'info');
  }

  deleteCategory(event: CdkDragDrop<ICategory>) {
    if (confirm("Вы действительно хотите удалить категорию " + this.categoryList[event.previousIndex].name + "? Отменить данное действие будет невозможно")) {
      this.service.removeCategory(this.categoryList[event.previousIndex]);
      this.notify.showNotification('Категория', 'Категория успешно удалена', 'success');
    }
    this.isCategoryMoving(false);
  }

  isCategoryMoving(bool: boolean) {
    this.iscategoryMoving = bool;
  }
}
