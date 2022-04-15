import {Component, OnInit, ViewChild} from '@angular/core';
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-cabinet-layout',
  templateUrl: './cabinet-layout.component.html',
  styleUrls: ['./cabinet-layout.component.css']
})
export class CabinetLayoutComponent implements OnInit {

  @ViewChild('customNotification', { static: true }) customNotificationTmpl: any;
  constructor(private service: NotifierService) { }

  ngOnInit(): void {
  }

  showNotification(label: string, msg: string, type: string) {
    this.service.show({
      label: label,
      message: msg,
      type: type,
      template: this.customNotificationTmpl,
    });
  }

}
