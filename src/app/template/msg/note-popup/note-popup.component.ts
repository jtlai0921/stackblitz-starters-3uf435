/**
 * 注意資訊
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-note-popup',
    templateUrl: './note-popup.component.html'
})
export class NotePopupComponent implements OnInit {

    title?: string;     // 自定標題
    content?: string;  // 自定內容

    promise: Promise<any>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.onClickEvent = () => {
                resolve();
            };
            this.onCancleEvent = () => {
                reject();
            };

        });
    }

    ngOnInit() {
        
    }

    onClickEvent() {
    }

    onCancleEvent() {
    }

}
