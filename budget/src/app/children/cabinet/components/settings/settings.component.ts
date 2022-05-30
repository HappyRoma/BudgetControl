import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LogService } from '../../services/log/log.service';
import { CustomValidators } from '../../../../validators/validators';
import { AppComponent } from '../../../../app.component';
import { ImageUploadService } from '../../services/image-upload/image-upload.service';
import { authState, getAuth, User } from '@angular/fire/auth';
import { MoneyType } from '../../../../models/classes/moneyType.class';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})

export class SettingsComponent {

    public $user: Observable<User | null> = authState(getAuth());
    public moneyList: MoneyType[] = this._logService.moneyTypesList;
    public settingForm: FormGroup = new FormGroup({
        nameValue: new FormControl(this._logService.username.getValue(), [Validators.required, Validators.maxLength(20)]),
        emailValue: new FormControl(this._logService.userEmail, [Validators.required, CustomValidators.emailValidator]),
        moneyValue: new FormControl(this._logService.currentMoneyType.getValue(), Validators.required)
    });

    constructor(private _logService: LogService, private _notify: AppComponent, private _imgUploadService: ImageUploadService) {
    }

    public uploadImage(event: any): void {
        this._imgUploadService.uploadImage(event.target.files[0]);
    }

    public onSubmit(): void {
        if (this.settingForm.invalid) {
            if (this.getError('nameValue', 'required')) {
                this._notify.showNotification('Имя', 'Это обязательное поле', 'error');
            }
            if (this.getError('nameValue', 'maxlength')) {
                this._notify.showNotification('Имя', 'Максимальное количество символов - 20', 'error');
            }
            if (this.getError('emailValue', 'required')) {
                this._notify.showNotification('Почта', 'Это обязательное поле', 'error');
            }
            if (this.getError('emailValue', 'email')) {
                this._notify.showNotification('Почта', 'Почта должна иметь вид: example@kek.gg', 'error');
            }

            Object.keys(this.settingForm.controls).forEach((controlName: string) => this.settingForm.controls[controlName].markAsTouched());

            return;
        }
        this._logService.setUsername(this.settingForm.value.nameValue);
        this._logService.setUserEmail(this.settingForm.value.emailValue);
        this._logService.setCurrentMoneyType(this.settingForm.value.moneyValue);
        this._notify.showNotification('Успешно', 'Ваши данные сохранены.', 'success');
    }

    private getError(control: string, error: string): boolean {
        return this.settingForm.get(control)?.getError(error);
    }
}
