import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../../../../app.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public iconIndex: number = 0;
  public colorIndex: number = 0;
  public previewName: string = 'Название';

  constructor(private modalService: ModalService, private notify: AppComponent) {
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

  ngOnInit(): void {
  }

  public categoryColors = [
    '#ef5350',
    '#ea3f7a',
    '#aa46bc',
    '#7d56c1',
    '#5b6abf',
    '#41a4f4',
    '#29b5f5',
    '#26c4d9',
    '#26a59a',
    '#65ba6a',
    '#9bca65',
    '#d2df57',
    '#fdec58',
    '#fdc829',
    '#fda627',
    '#fd6f43',
    '#8c6d63',
    '#bcbcbd',
    '#778f9c',
  ]

  public categoryIcons = [
    'url("assets/icons/category-icons/shoppingBag.svg")',
    'url("assets/icons/category-icons/health.svg")',
    'url("assets/icons/category-icons/gift.svg")',
    'url("assets/icons/category-icons/food.svg")',
    'url("assets/icons/category-icons/film.svg")',
    'url("assets/icons/category-icons/family.svg")',
    'url("assets/icons/category-icons/bus.svg")',
    'url("assets/icons/category-icons/basket.svg")'
  ];

  public categoryForm = new FormGroup({
    nameValue: new FormControl('', [Validators.required, Validators.maxLength(15)])
  })

  openModal(id: string) {
    this.modalService.open(id);
  }

  chooseIconIndex(index: number) {
    this.iconIndex = index;
  }

  chooseColorIndex(index: number) {
    this.colorIndex = index;
  }

}
