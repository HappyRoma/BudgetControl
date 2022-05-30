import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Category } from '../../../../models/classes/category.model';
import { LogService } from '../../services/log/log.service';

@Component({
    selector: 'category-icon',
    templateUrl: './category-icon.component.html',
    styleUrls: ['./category-icon.component.css']
})
export class CategoryIconComponent implements DoCheck {

  @Input() public category: Category | string = '';
  @Input() public size: number = 0;

  public currentCategory!: Category;
  private _categoryList: Category[] = [];

  constructor(private _service: LogService) {
      this._service.$categoryList.subscribe((catList: Category[]) => this._categoryList = catList );
  }

  public ngDoCheck(): void {
      if (typeof this.category === 'string') {
          this.currentCategory = this.getCategoryByName(this.category);
      }
      else {
          this.currentCategory = this.category;
      }
  }

  public getCategoryByName(categoryName: string): Category {
      return this._categoryList.find((category: Category) => category.name === categoryName)!;
  }

  public getSizeWithPx(size: number): string {
      return `${size.toString()}px`;
  }
}
