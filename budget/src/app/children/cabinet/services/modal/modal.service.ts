import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _modals: any[] = [];

    public add(modal: any): void {
        this._modals.push(modal);
    }

    public remove(id: string): void {
        this._modals = this._modals.filter(x => x.id !== id);
    }

    public open(id: string): void {
        const modal = this._modals.find(x => x.id === id);
        modal.open();
    }

    public close(id: string): void {
        const modal = this._modals.find(x => x.id === id);
        modal.close();
    }
}
