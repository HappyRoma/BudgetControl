import { Component } from '@angular/core';
import { LogService } from '../../services/log/log.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {

    public name: string = '';

    constructor(private _logService: LogService) {
        this._logService.$username.subscribe((name:string) => this.name = name);
    }
}
