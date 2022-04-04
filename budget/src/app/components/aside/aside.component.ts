import { Component, OnInit } from '@angular/core';
import {LogService} from "../../log.service";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  name: string = "";

  constructor(private logService: LogService) {
    this.logService.$username.subscribe(name => this.name = name)
  }

  ngOnInit(): void {

  }
}
