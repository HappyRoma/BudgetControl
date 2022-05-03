import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../../../../app.component";
import {LogService} from "../../services/log/log.service";
import {ICategory} from "../../../../models/interfaces/category.interface";
import {CdkDragDrop} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./styles/categories.component.css', './styles/add-category.component.css']
})
export class CategoriesComponent implements OnInit {

  public iconIndex: number = 0;
  public colorIndex: number = 0;
  public previewName: string = 'Название';
  public iscategoryMoving: boolean = false;

  constructor(private modalService: ModalService, private notify: AppComponent, private service: LogService) {
    this.isFormValid();
    this.service.$categoryList.subscribe(catList => {
      this.categoryList = catList;
    })
  }

  ngOnInit(): void {
  }

  public categoryColors = this.service.categoryColors;
  public categoryIcons = this.service.categoryIcons;
  public categoryList: ICategory[] = [];

  public categoryForm = new FormGroup({
    nameValue: new FormControl('', [Validators.required, Validators.maxLength(15)])
  })

  private isFormValid() {
    this.categoryForm.statusChanges.subscribe((status) => {
      if (status === "VALID") {
        this.previewName = this.categoryForm.value.nameValue;
      }
      if (status === "INVALID") {
        this.previewName = 'Название';
        this.notify.showNotification('Название', 'Название должно быть не длиннее 15 символов', 'error');
      }
    })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  chooseIconIndex(index: number) {
    this.iconIndex = index;
  }

  chooseColorIndex(index: number) {
    this.colorIndex = index;
  }

  onSubmit() {
    const controls = this.categoryForm.controls;

    if (this.categoryForm.invalid) {
      if (this.categoryForm.get('nameValue')?.getError('required')) {
        this.notify.showNotification('Название', 'Это обязательное поле', 'error');
      }
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    try {
      this.service.addNewCategory(this.previewName, this.colorIndex, this.iconIndex);
      this.notify.showNotification('Категория', 'Категория успешно создана', 'success');
      this.modalService.close('createCategory');
      this.iconIndex = 0;
      this.colorIndex = 0;
      this.previewName = 'Название';
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
    }
    this.isCategoryMoving(false);
  }

  isCategoryMoving(bool: boolean) {
    this.iscategoryMoving = bool;
  }
}
