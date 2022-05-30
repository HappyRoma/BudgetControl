import { Component, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotifierNotificationOptions } from 'angular-notifier/lib/models/notifier-notification.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

  @ViewChild('customNotification', { static: true }) customNotificationTmpl: any;
  constructor(private _service: NotifierService) { }

  /**
   *
   * @param label - Заголовок уведомления
   * @param msg - Сообщение уведомления
   * @param type - Тип уведомления (default, error, info, success, warning)
   */

  public showNotification(label: string, msg: string, type: string): void {
      const notifierOption: NNO = {
          label: label,
          message: msg,
          type: type,
          template: this.customNotificationTmpl,
      };
      this._service.show(notifierOption);
  }
}

interface NNO extends NotifierNotificationOptions {
  label? : string;
}
