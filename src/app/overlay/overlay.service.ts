import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {Injectable} from "@angular/core";

export interface DialogData {
  title: string;
  message: string;
  type: string;
  timeout: number
  primaryButton;
  secondaryButton?;
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  title: string;
  message: string;
  type: string;

  constructor(public dialog: MatDialog) {
  }

  public  openDialog(dialogData: DialogData): void {
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

  public closeDialog():void {
    this.dialog.closeAll();
  }
}
