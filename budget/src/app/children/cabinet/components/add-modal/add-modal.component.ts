import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { LogService } from '../../services/log/log.service';
import { AppComponent } from '../../../../app.component';
import { CategoryFormParams } from '../../../../models/interfaces/form-params';


@Component({
    selector: 'add-modal',
    templateUrl: './add-modal.component.html',
    styleUrls: ['./add-modal.component.css']
})

export class AddModalComponent implements OnInit, OnDestroy {


  @Input() public type!: 'card' | 'category';
  @Output() public submitForm: EventEmitter<CategoryFormParams> = new EventEmitter<CategoryFormParams>();

  public formGroup: FormGroup = new FormGroup({
      nameValue: new FormControl('', [Validators.required, Validators.maxLength(15)])
  });

  public formName: string = '';
  public iconIndex: number = 0;
  public colorIndex: number = 0;
  public previewName: string = 'Название';
  public colors: string[] = this._service.colors;
  public icons: string[] = [];

  constructor(private _notify: AppComponent, private _service: LogService) {
      this.isFormValid();
  }

  public ngOnInit(): void {
      if (!this.type) {
          console.error('AddModal должен иметь type');

          return;
      }
      this.icons = this.type === 'category' ? this._service.categoryIcons : this._service.cardIcons;
      this.formName = this.type === 'category' ? 'Новая категория' : 'Новый счет';
  }

  public ngOnDestroy(): void {
      this.iconIndex = 0;
      this.colorIndex = 0;
      this.previewName = 'Название';
  }

  public chooseIconIndex(index: number): void {
      this.iconIndex = index;
  }

  public chooseColorIndex(index: number): void {
      this.colorIndex = index;
  }

  public onSubmit(): void {
      const controls = this.formGroup.controls;

      if (this.formGroup.invalid) {
          if (this.formGroup.get('nameValue')?.getError('required')) {
              this._notify.showNotification('Название', 'Это обязательное поле', 'error');
          }
          Object.keys(controls).forEach((controlName: string) => controls[controlName].markAsTouched());

          return;
      }
      this.submitForm.emit({
          name: this.previewName,
          colorIndex: this.colorIndex,
          iconIndex: this.iconIndex
      });
  }

  private isFormValid(): void {
      this.formGroup.statusChanges.subscribe((status: FormControlStatus) => {
          if (status === 'VALID') {
              this.previewName = this.formGroup.value.nameValue;
          }
          if (status === 'INVALID') {
              this.previewName = 'Название';
              this._notify.showNotification('Название', 'Название должно быть не длиннее 15 символов', 'error');
          }
      });
  }



}
