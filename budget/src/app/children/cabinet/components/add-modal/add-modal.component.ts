import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LogService} from "../../services/log/log.service";
import {AppComponent} from "../../../../app.component";
import {CategoryFormParams} from "../../../../models/interfaces/form-params";


@Component({
  selector: 'add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})

export class AddModalComponent implements OnInit {


  @Input() type!: 'card' | 'category';
  @Output() submitForm = new EventEmitter<CategoryFormParams>();

  public formName: string = '';
  public iconIndex: number = 0;
  public colorIndex: number = 0;
  public previewName: string = 'Название';
  public colors = this.service.colors;
  public icons: string[] = []

  constructor(private notify: AppComponent, private service: LogService) {
    this._isFormValid();
  }

  ngOnInit(): void {
    if (!this.type) {
      console.error("AddModal должен иметь type");

      return;
    }
    this.icons = this.type === 'category' ? this.service.categoryIcons : this.service.cardIcons
    this.formName = this.type === 'category' ? 'Новая категория' : 'Новый счет';
  }

  ngOnDestroy(): void {
    this.iconIndex = 0;
    this.colorIndex = 0;
    this.previewName = 'Название';
  }

  public formGroup = new FormGroup({
    nameValue: new FormControl('', [Validators.required, Validators.maxLength(15)])
  })

  private _isFormValid() {
    this.formGroup.statusChanges.subscribe((status) => {
      if (status === "VALID") {
        this.previewName = this.formGroup.value.nameValue;
      }
      if (status === "INVALID") {
        this.previewName = 'Название';
        this.notify.showNotification('Название', 'Название должно быть не длиннее 15 символов', 'error');
      }
    })
  }

  chooseIconIndex(index: number) {
    this.iconIndex = index;
  }

  chooseColorIndex(index: number) {
    this.colorIndex = index;
  }

  onSubmit() {
    const controls = this.formGroup.controls;

    if (this.formGroup.invalid) {
      if (this.formGroup.get('nameValue')?.getError('required')) {
        this.notify.showNotification('Название', 'Это обязательное поле', 'error');
      }
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    this.submitForm.emit({
      name: this.previewName,
      colorIndex: this.colorIndex,
      iconIndex: this.iconIndex
    });
  }

}
