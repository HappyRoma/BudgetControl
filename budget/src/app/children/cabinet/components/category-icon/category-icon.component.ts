import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnInit} from '@angular/core';
import {Category} from "../../../../models/classes/category.model";
import {LogService} from "../../services/log/log.service";
import {Observable} from "rxjs";

@Component({
  selector: 'category-icon',
  templateUrl: './category-icon.component.html',
  styleUrls: ['./category-icon.component.css']
})
export class CategoryIconComponent implements OnInit {

  @Input() category: Category | string | null = '';
  @Input() size: number = 0;

  private categoryList: Category[] = [];
  public currentCategory!: Category;

  constructor(private service: LogService) {
    this.service.$categoryList.subscribe(catList => this.categoryList = catList );
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    if (typeof this.category === "string") {
      this.currentCategory = this.getCategoryByName(this.category);
    }
    else {
      // @ts-ignore
      this.currentCategory = this.category;
    }
  }

  getCategoryByName(categoryName: string | null): Category {
    // @ts-ignore
    return this.categoryList.find(category => category.name === categoryName);
  }

  getSizeWithPx(size: number): string {
   return `${size.toString()}px`
  }
}
