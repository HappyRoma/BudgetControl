import { Component, OnInit } from '@angular/core';
import {LogService} from "../../services/log.service";
import {UserFirebaseService} from "../../../../services/user-firebase.service";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css', 'aside.component.less']
})
export class AsideComponent implements OnInit {

  name: string = "";

  constructor(private logService: LogService) {
    this.logService.$username.subscribe(name => this.name = name);
  }

  ngOnInit(): void {
  }

  readonly value: number[] = [30000, 5000];
  readonly difference = this.value[0]-this.value[1];

  getValue(index: number): number {
    return Number.isNaN(index) ? this.difference : this.value[index];
  }

  readonly labelsX: string[] = ['ДЕК','ЯНВ','ФЕВ','МАР'];
  readonly labelsY: string[] = ['0', '20000', '30000', '40000', '50000'];
  readonly axeValue: [number[], number[]] = [
    [25000, 32000, 35000, 32000],
    [38000, 41000, 47000, 45000]
  ];
}
