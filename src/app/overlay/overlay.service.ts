import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {Injectable} from "@angular/core";

export interface DialogData {
  title: string;
  message: string;
  type: string;
  timeout?: number;
  primaryButton: { name, function? };
  secondaryButton?: { name, function? };
  inputVisible?: boolean;
  inputValue?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  title: string;
  message: string;
  type: string;
  input: string;

  constructor(public dialog: MatDialog) {
  }

  /**
   * sets up a dynamically structured dialog
   * @param dialogData
   */
  public openDialog(dialogData: DialogData): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: '80%',
      panelClass: dialogData.type,
      data: {
        title: dialogData.title,
        message: dialogData.message,
        primaryButton: dialogData.primaryButton,
        secondaryButton: dialogData.secondaryButton,
        inputVisible: dialogData.inputVisible
      }
    });

    if (dialogData.timeout) {
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
          dialogRef.close();
        }, dialogData.timeout)
      })
    }

    dialogRef.afterClosed().subscribe(result => {
      this.input = dialogRef.componentInstance.data.inputValue;
      typeof result === 'function' ? result() : "";
    });
  }

  /**
   * Closes the dialog window
   */
  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
