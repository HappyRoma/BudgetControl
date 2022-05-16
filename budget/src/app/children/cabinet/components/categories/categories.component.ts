import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {AppComponent} from "../../../../app.component";
import {LogService} from "../../services/log/log.service";
import {CategoryType, ICategory} from "../../../../models/interfaces/category.interface";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {FormParams} from "../../../../models/interfaces/form-params";
import {Category} from "../../../../models/classes/category.model";
import {AddOperationModalComponent} from "../add-operation-modal/add-operation-modal.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./styles/categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public iscategoryMoving: boolean = false;
  public categoriesType: CategoryType = 'expend'
  @ViewChild(AddOperationModalComponent) child!: AddOperationModalComponent;

  constructor(private modalService: ModalService, private notify: AppComponent, private service: LogService) {
    this.service.$categoryList.subscribe(catList => {
      this.categoryList = catList;
      this.separateCategoryList();
    })
  }

  ngOnInit(): void {
  }

  private categoryList: Category[] = [];
  public categoryListExpend: Category[] = [];
  public categoryListIncome: Category[] = [];

  separateCategoryList() {
    this.categoryListIncome = [];
    this.categoryListExpend = [];
    this.categoryList.forEach(category => {
      if (category.type === 'expend') {
        this.categoryListExpend.push(category);
      }
      else {
        this.categoryListIncome.push(category);
      }
    })
  }

  switchCatType() {
    this.categoriesType = this.categoriesType === 'expend' ? 'income' : 'expend';
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  setCurrentCategory(category: Category) {
    this.child.setCurrentCategory(category);
  }

  onSubmit(event: FormParams) {
    try {
      this.service.addNewCategory(event.name, event.colorIndex, event.iconIndex, this.categoriesType);
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
    // @ts-ignore
    if (confirm("Вы действительно хотите удалить категорию " + event.previousContainer.data[event.previousIndex].name + "? Отменить данное действие будет невозможно")) {
      // @ts-ignore
      this.service.removeCategory(event.previousContainer.data[event.previousIndex]);
      this.notify.showNotification('Категория', 'Категория успешно удалена', 'success');
    }
    this.isCategoryMoving(false);
  }

  isCategoryMoving(bool: boolean) {
    this.iscategoryMoving = bool;
  }
}
