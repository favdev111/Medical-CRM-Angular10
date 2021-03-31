import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { AlertType } from '../../models/enums/alert-type';

export interface DialogData {
  title: string;
  content: string;
  type: AlertType;
  acceptText?: string;
  declineText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  type: AlertType = AlertType.None;
  acceptEvent = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.type) {
      this.type = data.type;
    }
  }

  ngOnInit(): void { }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
