import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../overlay.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  /**
   * warns the user in case of an empty mandatory field
   *
   * @param inputField the blank field
   */
  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' : '';
  }

}
