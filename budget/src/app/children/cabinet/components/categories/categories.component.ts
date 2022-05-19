import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {AppComponent} from "../../../../app.component";
import {LogService} from "../../services/log/log.service";
import {CategoryType, ICategory} from "../../../../models/interfaces/category.interface";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {FormParams} from "../../../../models/interfaces/form-params";
import {Category} from "../../../../models/classes/category.model";
import {AddOperationModalComponent} from "../add-operation-modal/add-operation-modal.component";
import {Day} from "../../../../models/classes/day.model";
import {map, Observable} from "rxjs";

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
  }

  public get categoryValues$(): Observable<readonly number[]> {
    return this.service.$categoryList.pipe(
      map((catList) => {
        this.categoryList = catList;
        this.separateCategoryList();
        this.setCategoryValues();

        this.service.differentCategory$.subscribe(
          (difCat) => {
            this.categoryNamesExpend.push(difCat.name);
            let sum = 0;
            difCat.operationList?.forEach(operation => {
              if (new Day().getDate(operation.date, "month") === new Day().getTodayDate('month')
                && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
                sum += operation.value;
              }
            })
            this.categoryValueExpend.push(Math.abs(sum));
          }
        )

        if (this.categoriesType === 'expend') {
          return this.categoryValueExpend;
        }
        else {
          return this.categoryValueIncome;
        }
      })
    )

  }

  ngOnInit(): void {
  }

  private categoryList: Category[] = [];
  public categoryListExpend: Category[] = [];
  public categoryListIncome: Category[] = [];
  public categoryNamesExpend: string[] = [];
  public categoryNamesIncome: string[] = [];
  public categoryValueExpend: number[] = [];
  public categoryValueIncome: number[] = [];
  public valueSumExpend: number = 0;
  public valueSumIncome: number = 0;

  separateCategoryList(): void {
    this.categoryListIncome = [];
    this.categoryListExpend = [];
    this.categoryNamesExpend = [];
    this.categoryNamesIncome = [];
    this.categoryList.forEach(category => {
      if (category.type === 'expend') {
        this.categoryListExpend.push(category);
        this.categoryNamesExpend.push(category.name);
      }
      else {
        this.categoryListIncome.push(category);
        this.categoryNamesIncome.push(category.name);
      }
    })
   // this.categoryNamesExpend.push(this.service.differentCategory.getValue().name);
    console.log(this.categoryNamesExpend);
  }

  setCategoryValues() {
    this.categoryValueExpend = [];
    this.categoryValueIncome = [];
    this.valueSumExpend = 0;
    this.valueSumIncome = 0;

    this.categoryListExpend.forEach(category => {
      let sum = 0;
      category.operationList?.forEach(operation => {
        if (new Day().getDate(operation.date, "month") === new Day().getTodayDate('month')
          && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
          sum += operation.value
        }
      });
      this.valueSumExpend += sum;
      this.categoryValueExpend.push(Math.abs(sum));
    })
    this.categoryListIncome.forEach(category => {
      let sum = 0;
      category.operationList?.forEach(operation => {
        if (new Day().getDate(operation.date, "month") === new Day().getTodayDate('month')
          && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
          sum += operation.value
        }
      });
      this.valueSumIncome += sum;
      this.categoryValueIncome.push(Math.abs(sum));
    })

   // this.categoryValueExpend.push(Math.abs(this.service.differentCategory.getValue().operationList[0].value));
  }

  getCategoryName(index: number): string {
    if (this.categoriesType === 'expend') {
      return Number.isNaN(index) ? 'Расходы': this.categoryNamesExpend[index];
    }

    return Number.isNaN(index) ? 'Доходы' : this.categoryNamesIncome[index];
  }

  getCategoryValue(index: number): number {
    if (this.categoriesType === 'expend') {
      return Number.isNaN(index) ? Math.abs(this.valueSumExpend) : this.categoryValueExpend[index];
    }

    return Number.isNaN(index) ? Math.abs(this.valueSumIncome) : this.categoryValueIncome[index]
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
