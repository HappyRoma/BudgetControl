import {Component, ViewChild} from '@angular/core';
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  @ViewChild('customNotification', { static: true }) customNotificationTmpl: any;
  constructor(private service: NotifierService) { }

  /**
   *
   * @param label - Заголовок уведомления
   * @param msg - Сообщение уведомления
   * @param type - Тип уведомления (default, error, info, success, warning)
   */

  showNotification(label: string, msg: string, type: string) {
    this.service.show({
      label: label,
      message: msg,
      type: type,
      template: this.customNotificationTmpl,
    });
  }
}
