import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log/log.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    public name: string = '';

    constructor(private _logService: LogService) {
        this._logService.$username.subscribe((name:string) => this.name = name);
    }

    public ngOnInit(): void {
    }

}
