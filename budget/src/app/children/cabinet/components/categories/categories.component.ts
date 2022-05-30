import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { AppComponent } from '../../../../app.component';
import { LogService } from '../../services/log/log.service';
import { CategoryType, ICategory } from '../../../../models/interfaces/category.interface';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CategoryFormParams, OperationFormParams } from '../../../../models/interfaces/form-params';
import { Category } from '../../../../models/classes/category.model';
import { AddOperationModalComponent } from '../add-operation-modal/add-operation-modal.component';
import { Day } from '../../../../models/classes/day.model';
import { map, Observable } from 'rxjs';
import { Operation } from '../../../../models/classes/operation.model';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./styles/categories.component.css', './styles/categories.component.less']
})
export class CategoriesComponent implements OnInit {

    @ViewChild(AddOperationModalComponent) child!: AddOperationModalComponent;

    public iscategoryMoving: boolean = false;
    public categoriesType: CategoryType = 'expend';
    public categoryListExpend: Category[] = [];
    public categoryListIncome: Category[] = [];
    public categoryNamesExpend: string[] = [];
    public categoryNamesIncome: string[] = [];
    public categoryValueExpend: number[] = [];
    public categoryValueIncome: number[] = [];
    public valueSumExpend: number = 0;
    public valueSumIncome: number = 0;
    private _categoryList: Category[] = [];



    constructor(private _modalService: ModalService,
              private _notify: AppComponent,
              private _service: LogService,
              private _elRef: ElementRef) {
    }

    public get categoryValues$(): Observable<readonly number[]> {
        return this._service.$categoryList.pipe(
            map((catList: Category[]) => {
                this._categoryList = catList;
                this.separateCategoryList();
                this.setCategoryValues();

                this._service.differentCategory$.subscribe(
                    (difCat: Category) => {
                        this.categoryNamesExpend.push(difCat.name);
                        let sum: number = 0;
                        difCat.operationList?.forEach((operation: Operation) => {
                            if (new Day().getDate(operation.date, 'month') === new Day().getTodayDate('month')
                && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
                                sum += operation.value;
                            }
                        });
                        this.valueSumExpend += sum;
                        this.categoryValueExpend.push(Math.abs(sum));
                    }
                );
                this.setChartColors();

                if (this.categoriesType === 'expend') {
                    return this.categoryValueExpend;
                }
                else {
                    return this.categoryValueIncome;
                }
            })
        );
    }

    public ngOnInit(): void {
    }

    public getCategoryName(index: number): string {
        if (this.categoriesType === 'expend') {
            return Number.isNaN(index) ? 'Расходы': this.categoryNamesExpend[index];
        }

        return Number.isNaN(index) ? 'Доходы' : this.categoryNamesIncome[index];
    }

    public getCategoryValue(index: number): number {
        if (this.categoriesType === 'expend') {
            return Number.isNaN(index) ? Math.abs(this.valueSumExpend) : this.categoryValueExpend[index];
        }

        return Number.isNaN(index) ? Math.abs(this.valueSumIncome) : this.categoryValueIncome[index];
    }

    public switchCatType(): void {
        this.categoriesType = this.categoriesType === 'expend' ? 'income' : 'expend';
        this.setChartColors();
    }

    public openModal(id: string): void {
        this._modalService.open(id);
    }

    public setCurrentCategory(category: Category): void {
        this.child.setCurrentCategory(category);
    }

    public onSubmit(event: CategoryFormParams): void {
        try {
            this._service.addNewCategory(event.name, event.colorIndex, event.iconIndex, this.categoriesType);
            this._notify.showNotification('Категория', 'Категория успешно создана', 'success');
            this._modalService.close('createCategory');
        }
        catch (error) {
            this._notify.showNotification('Категория', 'Категория с таким именем уже существует', 'error');
        }
    }

    public onSubmitOperation(event: OperationFormParams): void {
        this._service.addOperation(event.category, event.card, event.date, event.value);
        this._notify.showNotification('Операция','Операция успешна добавлена', 'success');
        this._modalService.close('createOperation');
    }

    public showBinInfo(): void {
        this._notify.showNotification('Удаление категории', 'Перенесите сюда категорию, чтобы удалить ее.', 'info');
    }

    public deleteCategory(event: CdkDragDrop<ICategory>): void {
        // @ts-ignore
        if (confirm('Вы действительно хотите удалить категорию ' + event.previousContainer.data[event.previousIndex].name + '? Отменить данное действие будет невозможно')) {
            // @ts-ignore
            this._service.removeCategory(event.previousContainer.data[event.previousIndex]);
            this._notify.showNotification('Категория', 'Категория успешно удалена', 'success');
        }
        this.isCategoryMoving(false);
    }

    public isCategoryMoving(bool: boolean): void {
        this.iscategoryMoving = bool;
    }

    private separateCategoryList(): void {
        this.categoryListIncome = [];
        this.categoryListExpend = [];
        this.categoryNamesExpend = [];
        this.categoryNamesIncome = [];
        this._categoryList.forEach((category: Category) => {
            if (category.type === 'expend') {
                this.categoryListExpend.push(category);
                this.categoryNamesExpend.push(category.name);
            }
            else {
                this.categoryListIncome.push(category);
                this.categoryNamesIncome.push(category.name);
            }
        });
    }

    private setCategoryValues(): void {
        this.categoryValueExpend = [];
        this.categoryValueIncome = [];
        this.valueSumExpend = 0;
        this.valueSumIncome = 0;

        this.categoryListExpend.forEach((category: Category) => {
            let sum: number = 0;
            category.operationList?.forEach((operation: Operation) => {
                if (new Day().getDate(operation.date, 'month') === new Day().getTodayDate('month')
                    && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
                    sum += operation.value;
                }
            });
            this.valueSumExpend += sum;
            this.categoryValueExpend.push(Math.abs(sum));
        });
        this.categoryListIncome.forEach((category: Category) => {
            let sum: number = 0;
            category.operationList?.forEach((operation: Operation) => {
                if (new Day().getDate(operation.date, 'month') === new Day().getTodayDate('month')
                    && new Day().getDate(operation.date, 'year') === new Day().getTodayDate('year')) {
                    sum += operation.value;
                }
            });
            this.valueSumIncome += sum;
            this.categoryValueIncome.push(Math.abs(sum));
        });
    }

    private setChartColors(): void {
        if (this.categoriesType === 'expend') {
            this.categoryListExpend.forEach((category: Category, index: number) => {
                this._elRef.nativeElement.style.setProperty(`--chart-${index}`, category.color);
            });
            this._elRef.nativeElement.style.setProperty(`--chart-${this.categoryListExpend.length}`, '#939292');
        }
        else {
            this.categoryListIncome.forEach((category: Category, index: number) => {
                this._elRef.nativeElement.style.setProperty(`--chart-${index}`, category.color);
            });
        }
    }
}
