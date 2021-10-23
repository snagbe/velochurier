import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";

export interface DialogData {
  type: string;
  message: string;
}

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {

  type: string;
  message: string;

  constructor(public dialog: MatDialog) {
  }

  openDialog(dialogData: DialogData): void {
    this.dialog.open(DialogComponent, {
      maxWidth: '50%',
      data: {type: dialogData.type, message: dialogData.message}
    });
  }
}