import {Component, OnInit} from '@angular/core';
import {LogService} from "../../../../services/log.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  name: string = "";

  constructor(private logService: LogService) {
    this.logService.$username.subscribe(name => this.name = name);
  }

  ngOnInit(): void {
  }

}
