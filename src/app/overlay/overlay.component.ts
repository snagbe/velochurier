import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";

export interface DialogData {
  title: string;
  message: string;
  type: string;
  timeout: number
  primaryButton;
  secondaryButton?;
}

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {

  title: string;
  message: string;
  type: string;

  constructor(public dialog: MatDialog) {
  }

  openDialog(dialogData: DialogData): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: '50%',
      panelClass: dialogData.type,
      data: {title: dialogData.title, message: dialogData.message, primaryButton: dialogData.primaryButton, secondaryButton: dialogData.secondaryButton}
    });

    if (dialogData.timeout) {
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
          dialogRef.close();
        }, dialogData.timeout)
      })
    }
  }

  closeDialog():void {
    this.dialog.closeAll();
  }
}
